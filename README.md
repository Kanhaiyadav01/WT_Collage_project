# 🚀 Resumind – AI-Powered Resume Analyzer with Firebase

A **production-ready** AI Resume Analyzer web application that helps job seekers optimize their resumes using **Google Gemini AI**, **Firebase Authentication**, and **Firestore Database**.

**Live Demo**: https://wt-collage-project.vercel.app/

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Installation & Setup](#installation--setup)
6. [Firebase Configuration](#firebase-configuration)
7. [How It Works (Detailed Flow)](#how-it-works-detailed-flow)
8. [File Structure](#file-structure)
9. [Authentication System](#authentication-system)
10. [Database Schema](#database-schema)
11. [API Integration](#api-integration)
12. [Environment Variables](#environment-variables)
13. [Running Locally](#running-locally)
14. [Deployment](#deployment)
15. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Resumind** is an intelligent resume analysis tool that:
- Authenticates users via **Firebase (Google + Email/Password)**
- Analyzes resumes against job descriptions using **Google Gemini AI**
- Stores analysis history in **Firestore Database**
- Provides detailed feedback on ATS compatibility, skills match, and improvement suggestions
- Generates interview questions based on resume & job description

### Problem Solved
Most resumes get rejected due to:
- ❌ Not being ATS-friendly
- ❌ Missing critical keywords
- ❌ Poor structure and formatting
- ❌ Generic content without metrics

**Solution**: Instant AI-powered analysis with specific, actionable feedback.

---

##  Key Features

### 1. **User Authentication**
- ✅ Google Sign-In (OAuth)
- ✅ Email/Password Registration
- ✅ Password validation
- ✅ Persistent login state
- ✅ Secure logout

### 2. **Resume Analysis**
- ✅ PDF upload with text extraction
- ✅ AI-powered resume evaluation
- ✅ ATS score calculation
- ✅ Missing keywords identification
- ✅ Skill gap analysis
- ✅ Section-wise feedback (Tone, Content, Structure, Skills)
- ✅ Interview question generator (7 questions - easy/medium/hard)

### 3. **User Dashboard**
- ✅ View all past analyses
- ✅ Sort by date (newest first)
- ✅ Delete/archive old analyses
- ✅ Quick details on each card

### 4. **Protected Routes**
- ✅ Unauthorized users redirected to login
- ✅ Auth state persistence
- ✅ Loading states during auth check

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework & build tool |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **State Management** | Context API | Global auth & form state |
| **Authentication** | Firebase Auth | Google & Email/Password auth |
| **Database** | Firestore (NoSQL) | User profiles & analysis history |
| **AI Integration** | Google Gemini API | Resume analysis |
| **PDF Processing** | pdf.js | Extract text from PDFs |
| **Routing** | React Router v6 | Client-side navigation |
| **Deployment** | Vercel | Hosting & CI/CD |

---

## 🏗️ Architecture

### High-Level Flow
```
User
  ↓
[Frontend React App]
  ↓
┌─────────────────────────────────┐
│  Authentication Layer           │
│  (Firebase Auth)                │
│  ├─ Google OAuth                │
│  └─ Email/Password              │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Upload & Analysis              │
│  ├─ PDF Text Extraction         │
│  ├─ Gemini API Call             │
│  └─ Result Storage (Firestore)  │
└─────────────────────────────────┘
  ↓
┌─────────────────────────────────┐
│  Data Persistence               │
│  (Firestore Database)           │
│  ├─ User Profiles               │
│  └─ Analysis History            │
└─────────────────────────────────┘
  ↓
[Dashboard - View History]
```

### Component Hierarchy
```
<App>
├─ <AuthProvider>
│  ├─ <Navbar> (Auth state aware)
│  ├─ Public Routes
│  │  ├─ <Home>
│  │  ├─ <Login>
│  │  └─ <Signup>
│  └─ Protected Routes
│     ├─ <Upload>
│     ├─ <Analyzing>
│     ├─ <Results>
│     └─ <Dashboard>
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Firebase project created
- Google Cloud project with Gemini API enabled

### Step 1: Clone Repository
```bash
git clone https://github.com/Kanhaiyadav01/WT_Collage_project.git
cd WT_Collage_project
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create `.env.local` file in root directory:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# Gemini API
REACT_APP_GEMINI_KEY=your_gemini_api_key
```

### Step 4: Start Development Server
```bash
npm run dev
```

Application runs at `http://localhost:5173`

---

## 🔐 Firebase Configuration

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name: `resumind` (or any name)
4. Accept terms and create project
5. Select **"Web"** platform
6. Copy the Firebase config

### Step 2: Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** 
   - Click Google provider
   - Set support email
   - Copy OAuth Client ID
3. Enable **Email/Password**
   - Click Email/Password provider
   - Enable both email/password and email link options

### Step 3: Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create Database"**
3. Start in **"Production Mode"**
4. Select nearest region (e.g., `us-central1`)
5. Wait for initialization

### Step 4: Set Security Rules
Replace default Firestore rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - each user can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Analyses collection - each user can read/write their own analyses
    match /analyses/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 5: Enable Google OAuth
1. Go to **Google Cloud Console**
2. Select your project
3. Go to **Credentials** → **OAuth 2.0 Client IDs**
4. Add authorized redirect URIs:
   - `http://localhost:5173`
   - `http://localhost:5173/login`
   - Your production domain

---

## 🔄 How It Works (Detailed Flow)

### **User Flow Step-by-Step**

#### **1. User Registration**
```
┌─────────────────────────────┐
│ User visits /signup         │
│ - Enters email              │
│ - Enters password           │
│ - Confirms password         │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Validation in Frontend      │
│ - Email format check        │
│ - Password strength (8+ chars)
│ - Match confirmation        │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Firebase Auth Setup         │
│ createUserWithEmailAndPassword()
│ ↓                           │
│ Creates auth user           │
│ ↓                           │
│ Auto-saves to Firestore     │
│ {                           │
│   uid: auto,                │
│   email: user@email.com,    │
│   displayName: "",          │
│   photoURL: "",             │
│   createdAt: timestamp      │
│ }                           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Auto Login & Redirect       │
│ → Navigate to /upload       │
└─────────────────────────────┘
```

**Code Reference** (`src/pages/Signup.jsx`):
```javascript
const handleSignup = async () => {
  // 1. Validate
  if (!email || !password || password !== confirmPassword) return;
  
  // 2. Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // 3. Save profile to Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: "",
    photoURL: "",
    createdAt: new Date(),
  });
  
  // 4. Auth state listener auto-redirects
};
```

---

#### **2. User Login**
```
┌─────────────────────────────┐
│ User visits /login          │
│ - Enters email              │
│ - Enters password           │
│ - Clicks "Sign In"          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Firebase Authentication     │
│ signInWithEmailAndPassword()│
│ OR                          │
│ signInWithPopup(googleAuth) │
│ ↓                           │
│ Validates credentials       │
│ ↓                           │
│ Creates session token       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ AuthContext Updates         │
│ useAuthState() triggers     │
│ ↓                           │
│ Sets user in context        │
│ ↓                           │
│ Re-renders all components   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Route Protection Check      │
│ <ProtectedRoute />          │
│ - user exists? → Allow      │
│ - user null? → Redirect     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Redirect to /upload         │
│ or intended page            │
└─────────────────────────────┘
```

**Code Reference** (`src/pages/Login.jsx`):
```javascript
const handleGoogleSignIn = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  
  // Save to Firestore if new user
  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (!userDoc.exists()) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  }
};
```

---

#### **3. Resume Upload & Analysis**
```
┌─────────────────────────────────────┐
│ User visits /upload                 │
│ - Enters company name               │
│ - Enters job title                  │
│ - Pastes job description            │
│ - Uploads resume (PDF)              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Frontend Validation                 │
│ - Company name required?             │
│ - Job title required?                │
│ - JD length >= 50 words?            │
│ - PDF file selected?                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Navigate to /analyzing              │
│ (Show loading spinner)              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 1: Extract PDF Text            │
│ File → ArrayBuffer                  │
│     ↓                               │
│ pdf.js library processes            │
│     ↓                               │
│ Page by page text extraction        │
│     ↓                               │
│ Join all pages                      │
│     ↓                               │
│ resumeText = "Kanhaiya Yadav..."    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 2: Call Gemini API             │
│                                     │
│ POST to Google Gemini endpoint      │
│ {                                   │
│   "contents": [{                    │
│     "parts": [{                     │
│       "text": "PROMPT + RESUME + JD"│
│     }]                              │
│   }],                               │
│   "generationConfig": {             │
│     "temperature": 0.8,             │
│     "maxOutputTokens": 6000         │
│   }                                 │
│ }                                   │
│                                     │
│ Retry logic (3 attempts)            │
│ On 429/503 → Wait and retry         │
│ On success → Parse JSON response    │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 3: Gemini Analysis             │
│ AI generates:                       │
│ - overallScore (0-100)              │
│ - toneScore, contentScore, etc.     │
│ - atsScore                          │
│ - missingKeywords[]                 │
│ - suggestedKeywords[]               │
│ - sections[] with feedback          │
│ - interviewQuestions[]              │
│   {                                 │
│     question: "...",                │
│     difficulty: "easy|medium|hard", │
│     type: "technical|behavioral",   │
│     basedOn: "Resume: ... | JD: ..." │
│   }                                 │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 4: Save to Firestore           │
│                                     │
│ POST to /analyses collection        │
│ {                                   │
│   userId: "auth.uid",               │
│   company: "TechCorp",              │
│   jobTitle: "Frontend Dev",         │
│   overallScore: 78,                 │
│   atsScore: 82,                     │
│   analysis: {AI_RESULT},            │
│   createdAt: timestamp,             │
│   updatedAt: timestamp              │
│ }                                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Step 5: Display Results             │
│ Navigate to /results                │
│ - Show score with animation         │
│ - Display feedback cards            │
│ - Show missing keywords             │
│ - Show interview questions          │
│ - Option to view dashboard          │
└─────────────────────────────────────┘
```

**Code Reference** (`src/utils/geminiApi.js`):
```javascript
export async function analyzeWithGemini(resumeText, jobDesc, jobTitle, company) {
  // 1. Create prompt
  const prompt = `You are an ATS analyst...
    RESUME: ${resumeText}
    JOB DESCRIPTION: ${jobDesc}
    ...`;
  
  // 2. Call Gemini API
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 6000 }
    })
  });
  
  // 3. Parse response
  const data = await response.json();
  const result = JSON.parse(data.candidates[0].content.parts[0].text);
  return result;
}
```

**Firestore Save** (`src/pages/Results.jsx`):
```javascript
useEffect(() => {
  if (result && !savedFlag.current) {
    const saveAnalysis = async () => {
      const analysisData = {
        userId: currentUser.uid,
        company,
        jobTitle,
        overallScore: result.overallScore,
        atsScore: result.atsScore,
        analysis: result,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await addDoc(collection(db, "analyses"), analysisData);
      savedFlag.current = true;
    };
    saveAnalysis();
  }
}, [result]);
```

---

#### **4. View Analysis History (Dashboard)**
```
┌─────────────────────────────────────┐
│ User clicks "My Analyses"           │
│ Navigate to /dashboard              │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Query Firestore                     │
│ WHERE userId == currentUser.uid     │
│ ORDER BY createdAt DESC             │
│                                     │
│ db.collection("analyses")           │
│   .where("userId", "==", uid)       │
│   .orderBy("createdAt", "desc")     │
│   .getDocs()                        │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ Display Grid of Analyses            │
│ Each card shows:                    │
│ - Company name                      │
│ - Job title                         │
│ - Overall score                     │
│ - ATS score                         │
│ - Date analyzed                     │
│                                     │
│ Actions:                            │
│ - View details (expand)             │
│ - Delete analysis                   │
└─────────────────────────────────────┘
```

**Code Reference** (`src/pages/Dashboard.jsx`):
```javascript
useEffect(() => {
  const fetchAnalyses = async () => {
    const q = query(
      collection(db, "analyses"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const analyses = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setAnalyses(analyses);
  };
  
  fetchAnalyses();
}, [currentUser]);
```

---

## 📁 File Structure

```
src/
├── components/
│   ├── Navbar.jsx                 # Navigation bar with auth state
│   ├── FormInput.jsx              # Reusable form input component
│   ├── ProtectedRoute.jsx         # Route protection wrapper
│   └── Toast.jsx                  # Toast notifications
│
├── pages/
│   ├── Home.jsx                   # Landing page
│   ├── Login.jsx                  # Email/password + Google login
│   ├── Signup.jsx                 # User registration
│   ├── Upload.jsx                 # Resume upload form
│   ├── Analyzing.jsx              # Loading screen during analysis
│   ├── Results.jsx                # Analysis results display
│   └── Dashboard.jsx              # User analysis history
│
├── utils/
│   ├── firebase.js                # Firebase initialization
│   ├── AuthContext.jsx            # Global auth state (Context API)
│   ├── firestoreHelpers.js        # Firestore database operations
│   ├── geminiApi.js               # Gemini API integration
│   └── helpers.js                 # Utility functions
│
├── App.jsx                         # Main app with routing
├── App.css                         # Global styles
├── main.jsx                        # Entry point
└── index.css                       # Root styles

public/
├── favicon.svg
└── vite.svg

.env.local                          # Environment variables (local)
package.json                        # Dependencies
tailwind.config.js                 # Tailwind CSS config
postcss.config.js                  # PostCSS config
vite.config.js                     # Vite config
```

---

## 🔐 Authentication System

### Firebase Auth Setup

**File**: `src/utils/firebase.js`
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Global Auth Context

**File**: `src/utils/AuthContext.jsx`
```javascript
import { createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, loading, error] = useAuthState(auth);
  
  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Protected Routes

**File**: `src/components/ProtectedRoute.jsx`
```javascript
import { Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

### Usage in App.jsx
```javascript
<BrowserRouter>
  <AuthProvider>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />
      <Route path="/results" element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  </AuthProvider>
</BrowserRouter>
```

---

## 📊 Database Schema

### Firestore Collections Structure

#### **1. Users Collection**
```
collection: /users

Document ID: {uid}
{
  uid: "abc123xyz",
  email: "user@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  createdAt: Timestamp(2024, 3, 15),
  updatedAt: Timestamp(2024, 3, 15)
}
```

#### **2. Analyses Collection**
```
collection: /analyses

Document ID: {auto-generated}
{
  userId: "abc123xyz",                    // Reference to user
  company: "Google",
  jobTitle: "Senior Frontend Developer",
  overallScore: 82,
  atsScore: 85,
  analysis: {
    toneScore: 80,
    contentScore: 78,
    structureScore: 88,
    skillsScore: 81,
    issueCount: 3,
    atsBadgeType: "good",
    atsChecks: [
      { icon: "✅", text: "Clear formatting detected" },
      { icon: "⚠️", text: "Missing some keywords" }
    ],
    missingKeywords: ["React", "Redux", "TypeScript"],
    suggestedKeywords: ["Vue", "Angular", "Next.js"],
    sections: [
      {
        name: "Tone & Style",
        score: 80,
        badge: "Strong",
        badgeType: "green",
        feedbackCards: [...]
      }
    ],
    interviewQuestions: [
      {
        question: "Tell me about the React project...",
        difficulty: "medium",
        type: "technical",
        basedOn: "Resume: Project Name"
      }
    ]
  },
  createdAt: Timestamp(2024, 3, 15),
  updatedAt: Timestamp(2024, 3, 15)
}
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users - only owner can read/write
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Analyses - only owner can read/write
    match /analyses/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🤖 API Integration

### Google Gemini API

**Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`

**Method**: POST

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt with resume and JD"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.8,
    "maxOutputTokens": 6000
  }
}
```

**Response**:
```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "{ \"overallScore\": 82, \"atsScore\": 85, ... }"
          }
        ]
      }
    }
  ]
}
```

**File**: `src/utils/geminiApi.js`

### Prompt Structure
The AI prompt:
1. **Sets context**: "You are an ATS analyst..."
2. **Provides inputs**: Resume text + Job description
3. **Defines analysis**: "Analyze tone, content, structure, skills"
4. **Enforces specificity**: "DO NOT generate generic responses"
5. **Specifies output**: "Return ONLY JSON with this structure"

---

## 🔧 Environment Variables

Create `.env.local` in root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSy...
REACT_APP_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

# Gemini API
REACT_APP_GEMINI_KEY=AIzaSy...
```

**Security Note**: Never commit `.env.local` — add to `.gitignore`

---

## 🚀 Running Locally

### 1. Clone & Install
```bash
git clone https://github.com/Kanhaiyadav01/WT_Collage_project.git
cd WT_Collage_project
npm install
```

### 2. Setup .env.local
Copy Firebase and Gemini keys to `.env.local`

### 3. Start Dev Server
```bash
npm run dev
```

Output:
```
  VITE v4.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 4. Open Browser
```
http://localhost:5173
```

### Testing Auth
1. **Sign up** → Fill form → Register
2. **Login** → Enter credentials
3. **Upload** → Test resume analysis
4. **Dashboard** → View history

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder

### Deploy to Vercel

#### Option 1: CLI
```bash
npm i -g vercel
vercel
```

#### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select GitHub repo
5. Add environment variables
6. Deploy

#### Environment Variables on Vercel
1. Go to **Settings** → **Environment Variables**
2. Add all keys from `.env.local`
3. Redeploy

---

## 🐛 Troubleshooting

### Issue: "Firebase not initialized"
**Solution**: Check `.env.local` has all Firebase keys

### Issue: "Gemini API error 429 (Rate Limited)"
**Solution**: App has retry logic. Wait 5-10 seconds and try again

### Issue: "PDF extraction failed"
**Solution**: 
- Use text-based PDF, not scanned/image-based
- Try uploading a simpler PDF first
- Check browser console for errors

### Issue: "Auth state not persisting"
**Solution**:
- Clear browser cache & cookies
- Check Firebase Auth settings
- Verify Security Rules are correct

### Issue: "Analysis results not saving"
**Solution**:
- Check Firestore is enabled
- Verify Security Rules allow writes
- Check browser console for errors

### Issue: "GoogleSign-In popup blocked"
**Solution**:
- Disable popup blockers
- Check OAuth callback URLs in Google Console
- Verify localhost:5173 is in authorized URIs

---

## 📈 Performance Tips

1. **Lazy Load Routes**
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

2. **Memoize Components**
```javascript
export default memo(ResultsCard);
```

3. **Optimize Images**
- Use WebP format
- Compress PNGs with TinyPNG

4. **Enable Caching**
- Set proper cache headers
- Use Vercel's default caching

---

## 🔐 Security Best Practices

✅ **Never commit `.env.local`**  
✅ **Use Firebase Security Rules**  
✅ **Validate all user inputs**  
✅ **Sanitize PDF text extraction**  
✅ **Use HTTPS only**  
✅ **Keep dependencies updated**  

```bash
npm audit
npm audit fix
```

---

## 📚 Additional Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Google Gemini API](https://ai.google.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pdf.js Documentation](https://mozilla.github.io/pdf.js/)

---

## 🎓 Learning Outcomes

By building this project, you'll learn:
- ✅ Firebase Authentication (Google OAuth + Email/Password)
- ✅ Firestore Database (Real-time, NoSQL)
- ✅ React Context API for state management
- ✅ Protected Routes & Auth guards
- ✅ API integration (Gemini)
- ✅ PDF processing in JavaScript
- ✅ Deployment to production (Vercel)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

**Kanhaiya Yadav**
- GitHub: [@Kanhaiyadav01](https://github.com/Kanhaiyadav01)
- LinkedIn: [kanhaiya-yadav](https://linkedin.com/in/kanhaiya-yadav)

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 💡 Future Enhancements

- [ ] Downloadable PDF reports
- [ ] Resume rewriting suggestions
- [ ] Email notifications for analyses
- [ ] Dark/Light theme toggle
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced keyword analytics
- [ ] Resume template builder

---


