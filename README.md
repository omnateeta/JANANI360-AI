# 🏥 JANANI360 AI

> AI-Powered Maternal & Child Healthcare Ecosystem for Smart Pregnancy Monitoring, Emergency Referrals, and Public Health Management.

---

# 📖 Overview  

JANANI360 AI is a full-stack healthcare platform designed to improve maternal and child healthcare by connecting frontline health workers, doctors, hospitals, ambulance services, and health administrators into one unified digital ecosystem.

The platform helps identify high-risk pregnancies early using an AI-powered Clinical Decision Support System (CDSS), enables faster emergency referrals, and provides real-time visibility across the complete pregnancy journey—from registration to delivery and child care.

Rather than functioning as a standalone AI application, JANANI360 AI acts as a connected healthcare operating platform where AI assists healthcare professionals by providing risk analysis and clinical recommendations.

---

# 🎯 Problem Statement. 

Maternal healthcare in many regions faces several challenges:

- Paper-based pregnancy records
- Delayed identification of high-risk pregnancies
- Poor communication between PHCs and referral hospitals
- Manual referral processes
- Lack of real-time hospital resource visibility
- Fragmented patient records
- Language barriers for healthcare workers and patients

JANANI360 AI aims to digitize and streamline this complete workflow.

---

# 💡 Solution

JANANI360 AI provides one connected platform where:

- ASHA workers register pregnant women
- Doctors record ANC visits digitally
- AI automatically evaluates pregnancy risk
- High-risk cases are referred instantly
- Hospitals prepare before patient arrival
- Ambulance services receive emergency alerts
- Mother and child records remain connected throughout the healthcare lifecycle

---

# 👥 User Roles

The platform supports multiple healthcare stakeholders.

- ASHA Worker
- ANM Nurse
- PHC Doctor
- Hospital Administrator
- District Health Officer
- Pregnant Woman
- Family Member
- Lab Technician
- Pharmacist
- Ambulance Driver (108)

Each user has dedicated dashboards and permissions using Role-Based Access Control (RBAC).

---

# 🔄 System Workflow

```
Pregnancy Registration
        │
        ▼
Mother Profile Created
        │
        ▼
ANC Visit Recorded
        │
        ▼
AI Risk Analysis (Automatic)
        │
        ▼
Low / Medium / High / Critical Risk
        │
        ▼
Referral Recommendation
        │
        ▼
Hospital Selection
        │
        ▼
Bed Reservation
        │
        ▼
108 Ambulance Dispatch
        │
        ▼
Hospital Admission
        │
        ▼
Delivery
        │
        ▼
Child Profile Creation
        │
        ▼
Vaccination & Follow-up
```

---

# 🧠 Clinical Decision Support System (CDSS)

The embedded AI engine runs automatically whenever clinical information is updated.

It evaluates parameters such as:

- Blood Pressure
- Hemoglobin
- Weight
- Urine Protein
- Gestational Age
- Previous ANC History

The engine generates:

- Mother Safety Score
- Risk Level
- Clinical Recommendations
- Referral Priority
- Recommended Hospital

The AI acts as a decision-support tool and does **not** replace medical professionals.

---

# ✨ Key Features

## Maternal Care

- Pregnancy Registration
- Mother Profile
- ANC Visit Recording
- Medical History
- Document Management
- Activity Timeline

## AI Clinical Decision Support

- Mother Safety Score
- High-Risk Detection
- Explainable AI Recommendations
- Clinical Guideline Triggers

## Emergency Referral

- Digital Referral Workflow
- Smart Hospital Selection
- Bed Reservation
- Ambulance Tracking

## Hospital Management

- Hospital Dashboard
- Bed Availability
- Emergency Intake
- Referral Acceptance

## Child Care

- Delivery Records
- Child Profile
- Vaccination Schedule
- Growth Monitoring

## Administration

- District Analytics
- Audit Logs
- Role-Based Permissions
- Notification System

---

# 🏗️ Architecture

```
React + TypeScript Frontend
            │
            ▼
Node.js + Express Backend
            │
 ┌──────────┴──────────┐
 │                     │
 ▼                     ▼
Prisma Database     Python FastAPI
(SQLite / PostgreSQL)    AI Engine
```

---

# 🛠️ Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- Socket.IO

## Database

- SQLite (Development)
- PostgreSQL (Production Ready)

## AI Service

- Python
- FastAPI

---

# 🔐 Security

- JWT Authentication
- Role-Based Access Control
- Password Hashing (bcrypt)
- Audit Logging
- Session Management
- Permission-Based Authorization

---

# 📂 Project Structure

```
JANANI360-AI/

apps/
├── frontend/
├── backend/
└── ai-service/

docs/
README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/JANANI360-AI.git

cd JANANI360-AI
```

## Install Dependencies

Frontend

```bash
cd apps/frontend   
npm install
```

Backend

```bash
cd ../backend
npm install
```

AI Service

```bash
cd ../ai-service
pip install -r requirements.txt
```

---

# ▶️ Run the Project

Frontend

```bash
npm run dev
```

Backend

```bash
npm run dev
```

AI Service

```bash
uvicorn main:app --reload
```

---

# 📌 Current Development Status

| Module | Status |
|---------|--------|
| Master Data | ✅ Completed |
| Authentication & RBAC | ✅ Completed |
| Maternal Care Engine | ✅ Completed |
| Clinical Decision Support (AI) | ✅ Completed |
| Emergency Referral | ✅ Completed |
| Delivery & Child Care | 🚧 In Progress |
| Notifications | 🚧 Planned |
| Analytics Dashboard | 🚧 Planned |

---

# 📸 Screenshots

*(Add screenshots here after completing the UI.)*

---

# 🔮 Future Enhancements

- Offline-first support
- Google Maps integration
- SMS & WhatsApp notifications
- Voice assistance
- ABDM / ABHA integration
- Real-time analytics dashboard
- Multi-language support

---

# ⚠️ Disclaimer

JANANI360 AI is an academic/hackathon project developed to demonstrate how AI and digital healthcare workflows can improve maternal and child healthcare. The Clinical Decision Support System (CDSS) provides recommendations to assist healthcare professionals and is **not intended to replace medical judgment**.

---

# 👨‍💻 Team

Developed as part of a hackathon project.

```

This version is much more suitable for GitHub because it:
- avoids unsupported impact claims,
- accurately describes the architecture,
- is easy for judges and recruiters to understand,
- and presents the project professionally without overstating its deployment or affiliations.
