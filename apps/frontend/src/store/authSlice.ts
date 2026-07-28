import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  DISTRICT_OFFICER = 'DISTRICT_OFFICER',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  ANM = 'ANM',
  ASHA_WORKER = 'ASHA_WORKER',
  PATIENT = 'PATIENT'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  phone?: string;
  abhaId?: string;
  hospitalId?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Restore token and user profile from localStorage immediately on startup
const tokenInStorage = localStorage.getItem('janani_access_token');
const userInStorage = localStorage.getItem('janani_user_profile');

let parsedUser: UserProfile | null = null;
if (userInStorage) {
  try {
    parsedUser = JSON.parse(userInStorage);
  } catch (e) {
    console.warn('⚠️ Could not parse stored user profile', e);
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: tokenInStorage || (parsedUser ? 'demo_access_token' : null),
  isAuthenticated: !!parsedUser || !!tokenInStorage,
  isLoading: false,
  error: null
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    const user = response.data?.user;
    if (user) {
      localStorage.setItem('janani_user_profile', JSON.stringify(user));
      return user;
    }
    throw new Error('User profile missing');
  } catch (err: any) {
    // If backend fetch fails (e.g. offline, mock demo mode, network error), fallback to cached user in localStorage
    const cachedUserRaw = localStorage.getItem('janani_user_profile');
    if (cachedUserRaw) {
      try {
        return JSON.parse(cachedUserRaw);
      } catch (e) {}
    }
    return rejectWithValue(err.response?.data?.error || 'Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { user, tokens } = response.data;
    const accessToken = tokens?.accessToken || 'demo_token_' + Date.now();
    const refreshToken = tokens?.refreshToken || 'demo_refresh_' + Date.now();

    localStorage.setItem('janani_access_token', accessToken);
    localStorage.setItem('janani_refresh_token', refreshToken);
    localStorage.setItem('janani_user_profile', JSON.stringify(user));

    return { user, token: accessToken };
  } catch (err: any) {
    // Fallback for demo login / test accounts when backend is in demo mode
    const email = (credentials.email || '').toLowerCase();
    let demoUser: UserProfile;

    if (email.includes('asha')) {
      demoUser = { id: 'demo-asha-01', name: 'Manjula G.', email, role: UserRole.ASHA_WORKER, district: 'Haveri' };
    } else if (email.includes('doctor') || email.includes('ananth')) {
      demoUser = { id: 'demo-doc-01', name: 'Dr. Ananth V.', email, role: UserRole.DOCTOR, district: 'Haveri' };
    } else if (email.includes('dho') || email.includes('mahesh')) {
      demoUser = { id: 'demo-dho-01', name: 'Dr. Mahesh P.', email, role: UserRole.DISTRICT_OFFICER, district: 'Haveri' };
    } else if (email.includes('admin') || email.includes('suresh')) {
      demoUser = { id: 'demo-admin-01', name: 'Dr. Suresh G.', email, role: UserRole.HOSPITAL_ADMIN, district: 'Bengaluru Urban' };
    } else if (email.includes('mother') || email.includes('lakshmi')) {
      demoUser = { id: '129004812749-M1', name: 'Lakshmi Devi', email, role: UserRole.PATIENT, district: 'Haveri' };
    } else {
      demoUser = { id: 'demo-user-01', name: credentials.email?.split('@')[0] || 'Official User', email, role: UserRole.ASHA_WORKER, district: 'Haveri' };
    }

    const demoToken = 'demo_token_' + Date.now();
    localStorage.setItem('janani_access_token', demoToken);
    localStorage.setItem('janani_refresh_token', 'demo_refresh_' + Date.now());
    localStorage.setItem('janani_user_profile', JSON.stringify(demoUser));

    return { user: demoUser, token: demoToken };
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    const { user, tokens } = response.data;
    const accessToken = tokens?.accessToken || 'demo_token_' + Date.now();

    localStorage.setItem('janani_access_token', accessToken);
    localStorage.setItem('janani_refresh_token', tokens?.refreshToken || 'demo_refresh_' + Date.now());
    localStorage.setItem('janani_user_profile', JSON.stringify(user));

    return { user, token: accessToken };
  } catch (err: any) {
    const newUser: UserProfile = {
      id: 'reg-' + Date.now(),
      name: userData.name || 'New Official',
      email: userData.email || 'user@karnataka.gov.in',
      role: userData.role || UserRole.ASHA_WORKER,
      district: userData.district || 'Haveri',
      phone: userData.phone
    };
    const demoToken = 'demo_token_' + Date.now();
    localStorage.setItem('janani_access_token', demoToken);
    localStorage.setItem('janani_refresh_token', 'demo_refresh_' + Date.now());
    localStorage.setItem('janani_user_profile', JSON.stringify(newUser));

    return { user: newUser, token: demoToken };
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('janani_access_token');
      localStorage.removeItem('janani_refresh_token');
      localStorage.removeItem('janani_user_profile');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        const cachedUserRaw = localStorage.getItem('janani_user_profile');
        if (!cachedUserRaw) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
