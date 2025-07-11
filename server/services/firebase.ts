import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  // For server-side, we would typically use service account key
  // but for simplicity, we'll use the client config approach
};

// Initialize Firebase Admin only if not already initialized
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();

export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export async function createCustomToken(uid: string) {
  try {
    return await auth.createCustomToken(uid);
  } catch (error) {
    throw new Error('Failed to create custom token');
  }
}
