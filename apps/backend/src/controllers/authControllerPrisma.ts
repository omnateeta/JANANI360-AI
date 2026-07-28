import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { AuthenticatedRequest, AuthenticatedUserPayload } from '../middleware/rbac';
import { z } from 'zod';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'janani360_super_secret_access_key_2026';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'janani360_super_secret_refresh_key_2026';

const loginSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(1, 'Password is required')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

const generateTokens = (user: any) => {
  const payload: AuthenticatedUserPayload = {
    userId: user.id,
    role: user.role,
    email: user.email || undefined,
    phone: user.phone,
    name: user.name,
    districtId: user.districtId || undefined,
    talukId: user.talukId || undefined,
    facilityId: user.facilityId || undefined,
    subCenterId: user.subCenterId || undefined,
    catchmentId: user.catchmentId || undefined
  };

  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        details: validation.error.flatten().fieldErrors
      });
      return;
    }

    let { email, phone, password } = validation.data;
    if (email) email = email.trim().toLowerCase();
    if (phone) phone = phone.trim();
    if (password) password = password.trim();

    if (!email && !phone) {
      res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Must provide either email or phone for login'
      });
      return;
    }

    // Lookup User (Case-insensitive email match)
    const user = await prisma.user.findFirst({
      where: email ? { email: { equals: email } } : { phone },
      include: {
        district: { select: { id: true, nameEn: true, nameKn: true } },
        facility: { select: { id: true, nameEn: true, nameKn: true, tier: true } },
        subCenter: { select: { id: true, nameEn: true, nameKn: true } }
      }
    });

    if (!user) {
      console.warn(`⚠️ Login attempt failed: User not found for email="${email}", phone="${phone}"`);
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email/phone or password'
      });
      return;
    }

    // Check Account Status
    if (user.status === 'SUSPENDED') {
      res.status(403).json({
        success: false,
        error: 'ACCOUNT_SUSPENDED',
        message: 'This account has been suspended. Please contact administrator.'
      });
      return;
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.warn(`⚠️ Login attempt failed: Password mismatch for user="${user.email}"`);
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid email/phone or password'
      });
      return;
    }

    // Successful Login: Reset attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLogin: new Date()
      }
    });

    // Generate Tokens & Session
    const tokens = generateTokens(user);
    const refreshTokenHash = bcrypt.hashSync(tokens.refreshToken, 8);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    // Audit Log Login
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        actionType: 'USER_LOGIN',
        resource: 'AUTH',
        ipAddress: req.ip,
        deviceInfo: req.headers['user-agent']
      }
    });

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        staffId: user.staffId,
        abhaId: user.abhaId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        mustChangePassword: user.mustChangePassword,
        districtId: user.districtId,
        district: user.district,
        facilityId: user.facilityId,
        facility: user.facility,
        subCenterId: user.subCenterId,
        subCenter: user.subCenter
      },
      tokens,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error: any) {
    console.error('❌ Error in login:', error);
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'Authentication failed'
    });
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { refreshToken } = req.body;

    if (userId) {
      // Revoke latest session
      await prisma.userSession.updateMany({
        where: { userId, revoked: false },
        data: { revoked: true }
      });

      await prisma.auditLog.create({
        data: {
          userId,
          actionType: 'USER_LOGOUT',
          resource: 'AUTH',
          ipAddress: req.ip,
          deviceInfo: req.headers['user-agent']
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    console.error('❌ Error in logout:', error);
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/auth/logout-all
 */
export const logoutAll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      await prisma.userSession.updateMany({
        where: { userId },
        data: { revoked: true }
      });

      await prisma.auditLog.create({
        data: {
          userId,
          actionType: 'USER_LOGOUT_ALL',
          resource: 'AUTH',
          ipAddress: req.ip
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Revoked all sessions across all devices successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * POST /api/v1/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, error: 'Refresh token required' });
      return;
    }

    const decoded = jwt.verify(token, refreshSecret) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || user.status === 'SUSPENDED') {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const newTokens = generateTokens(user);

    res.status(200).json({
      success: true,
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      tokens: newTokens
    });
  } catch (error: any) {
    res.status(401).json({ success: false, error: 'INVALID_REFRESH_TOKEN' });
  }
};

/**
 * POST /api/v1/auth/change-password
 */
export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const validation = changePasswordSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ success: false, error: 'INVALID_INPUT', details: validation.error.flatten().fieldErrors });
      return;
    }

    const { currentPassword, newPassword } = validation.data;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ success: false, error: 'INVALID_CURRENT_PASSWORD', message: 'Current password does not match' });
      return;
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newHash,
        mustChangePassword: false,
        status: 'ACTIVE'
      }
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PASSWORD_CHANGED',
        resource: 'AUTH',
        ipAddress: req.ip
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};

/**
 * GET /api/v1/auth/me
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'UNAUTHORIZED' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        staffId: true,
        abhaId: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        mustChangePassword: true,
        districtId: true,
        district: { select: { id: true, nameEn: true, nameKn: true } },
        facilityId: true,
        facility: { select: { id: true, nameEn: true, nameKn: true, tier: true } },
        subCenterId: true,
        subCenter: { select: { id: true, nameEn: true, nameKn: true } }
      }
    });

    if (!user) {
      if (req.user) {
        res.status(200).json({
          success: true,
          user: req.user
        });
        return;
      }
      res.status(404).json({ success: false, error: 'USER_NOT_FOUND' });
      return;
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR' });
  }
};
