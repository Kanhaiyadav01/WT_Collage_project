import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ── USER PROFILE OPERATIONS ──
export async function saveUserProfile(uid, userData) {
  try {
    await setDoc(doc(db, "users", uid), {
      email: userData.email,
      displayName: userData.displayName || "",
      photoURL: userData.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(uid, updates) {
  try {
    await setDoc(doc(db, "users", uid), updates, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
}

// ── RESUME ANALYSIS OPERATIONS ──
export async function saveAnalysis(userId, analysisData) {
  try {
    const docRef = await addDoc(collection(db, "analyses"), {
      userId,
      resumeName: analysisData.resumeName || "Untitled Resume",
      jobTitle: analysisData.jobTitle || "",
      company: analysisData.company || "",
      overallScore: analysisData.overallScore || 0,
      toneScore: analysisData.toneScore || 0,
      contentScore: analysisData.contentScore || 0,
      structureScore: analysisData.structureScore || 0,
      skillsScore: analysisData.skillsScore || 0,
      atsScore: analysisData.atsScore || 0,
      issueCount: analysisData.issueCount || 0,
      atsBadgeType: analysisData.atsBadgeType || "warn",
      atsChecks: analysisData.atsChecks || [],
      missingKeywords: analysisData.missingKeywords || [],
      suggestedKeywords: analysisData.suggestedKeywords || [],
      sections: analysisData.sections || [],
      createdAt: serverTimestamp(),
      isArchived: false,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving analysis:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserAnalyses(userId) {
  try {
    const q = query(
      collection(db, "analyses"),
      where("userId", "==", userId),
      where("isArchived", "==", false)
    );
    const querySnapshot = await getDocs(q);
    const analyses = [];
    querySnapshot.forEach((doc) => {
      analyses.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: analyses };
  } catch (error) {
    console.error("Error fetching analyses:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteAnalysis(analysisId) {
  try {
    // Soft delete: set isArchived to true instead of deleting
    await setDoc(doc(db, "analyses", analysisId), { isArchived: true }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error deleting analysis:", error);
    return { success: false, error: error.message };
  }
}

export async function getAnalysisById(analysisId) {
  try {
    const docSnap = await getDoc(doc(db, "analyses", analysisId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: "Analysis not found" };
    }
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return { success: false, error: error.message };
  }
}
