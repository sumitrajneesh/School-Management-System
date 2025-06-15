// src/config/firebase.ts
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.warn('FIREBASE_SERVICE_ACCOUNT_PATH is not defined. Push notifications will not work.');
} else {
  try {
    // Initialize Firebase Admin SDK if not already initialized
    // Ensure the path is correct relative to where your app starts (dist folder in production)
    const serviceAccount = require(path.resolve(serviceAccountPath)); // Use path.resolve for robustness
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin SDK initialized.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK. Check FIREBASE_SERVICE_ACCOUNT_PATH and file content:', error);
  }
}

export const firebaseAdmin = admin; // Export the initialized admin object