
import admin from 'firebase-admin';

// This file is intended for server-side use only.

// Attempt to parse the service account key from environment variables.
// This is common in Vercel or other hosting environments.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// Initialize the Firebase Admin SDK, but only if it hasn't been initialized already.
// This prevents errors in development environments with hot-reloading.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If a service account is provided via environment variables, use it.
      // Otherwise, fall back to Application Default Credentials.
      // ADC is useful for local development (gcloud auth application-default login)
      // and in Google Cloud environments.
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.error('Firebase Admin SDK initialization failed:', error);
  }
}

// Export the initialized Firestore database instance for use in other server-side files.
export const db = admin.firestore();
