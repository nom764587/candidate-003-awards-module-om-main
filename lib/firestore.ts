import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
var serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '');
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
// Type for registration data
export type Registration = {
  regId: string;
  influencerId: string;
  email: string;
  name?: string;
  registeredAt: string;
};

// Type for badge data
export type Badge = {
  badgeId: string;
  influencerId: string;
  badge: string;
  awardedAt: string;
};

// Collection names for Firestore
const REGISTRATIONS_COLLECTION = 'registrations';
const BADGES_COLLECTION = 'badges';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

// Get Firestore instance
const db = getFirestore();

/**
 * Save registrations data to Firestore
 * @param registrations Array of registration objects
 * @returns Promise that resolves when all registrations are saved
 */
export async function saveRegistrationsToFirestore(registrations: Registration[]) {
  try {
    // Create a batch write to perform multiple operations atomically
    const batch = db.batch();
    
    // First, delete all existing registrations
    const existingDocs = await db.collection(REGISTRATIONS_COLLECTION).get();
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Then add all the new registrations
    registrations.forEach(registration => {
      const docRef = db.collection(REGISTRATIONS_COLLECTION).doc(registration.regId);
      batch.set(docRef, registration);
    });
    
    // Commit the batch
    await batch.commit();
    console.log('Registrations saved to Firestore successfully');
    
    return true;
  } catch (error) {
    console.error('Error saving registrations to Firestore:', error);
    throw error;
  }
}

/**
 * Load registrations data from Firestore
 * @returns Promise that resolves with array of registration objects
 */
export async function loadRegistrationsFromFirestore(): Promise<Registration[]> {
  try {
    const snapshot = await db.collection(REGISTRATIONS_COLLECTION).get();
    
    if (snapshot.empty) {
      console.log('No registrations found in Firestore, returning empty array');
      return [];
    }
    
    const registrations: Registration[] = [];
    snapshot.forEach(doc => {
      registrations.push(doc.data() as Registration);
    });
    
    return registrations;
  } catch (error) {
    console.log('Error loading registrations from Firestore, returning empty array:', error);
    return [];
  }
}

/**
 * Delete a specific registration from Firestore by ID
 * @param regId Registration ID to delete
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function deleteRegistrationFromFirestore(regId: string) {
  try {
    await db.collection(REGISTRATIONS_COLLECTION).doc(regId).delete();
    return true;
  } catch (error) {
    console.error('Error deleting registration from Firestore:', error);
    return false;
  }
}

/**
 * Generate a unique registration ID
 * @param existingRegistrations Array of existing registration objects
 * @returns A unique registration ID
 */
export function generateUniqueRegistrationId(existingRegistrations: Registration[]): string {
  // Get the highest existing ID number
  const existingIds = existingRegistrations.map(reg => reg.regId);
  let highestNum = 0;
  
  existingIds.forEach(id => {
    if (id.startsWith('SR_')) {
      const numPart = parseInt(id.substring(3), 10);
      if (!isNaN(numPart) && numPart > highestNum) {
        highestNum = numPart;
      }
    }
  });
  
  // Generate new ID with the next number
  return `SR_${String(highestNum + 1).padStart(3, '0')}`;
}

/**
 * Save a badge to Firestore
 * @param badge Badge object to save
 * @returns Promise that resolves when badge is saved
 */
export async function saveBadgeToFirestore(badge: Badge) {
  try {
    const docRef = db.collection(BADGES_COLLECTION).doc(badge.badgeId);
    await docRef.set(badge);
    console.log('Badge saved to Firestore successfully');
    return true;
  } catch (error) {
    console.error('Error saving badge to Firestore:', error);
    throw error;
  }
}

/**
 * Load badges data from Firestore
 * @returns Promise that resolves with array of badge objects
 */
export async function loadBadgesFromFirestore(): Promise<Badge[]> {
  try {
    const snapshot = await db.collection(BADGES_COLLECTION).get();
    
    if (snapshot.empty) {
      console.log('No badges found in Firestore, returning empty array');
      return [];
    }
    
    const badges: Badge[] = [];
    snapshot.forEach(doc => {
      badges.push(doc.data() as Badge);
    });
    
    return badges;
  } catch (error) {
    console.log('Error loading badges from Firestore, returning empty array:', error);
    return [];
  }
}

/**
 * Generate a unique badge ID
 * @param existingBadges Array of existing badge objects
 * @returns A unique badge ID
 */
export function generateUniqueBadgeId(existingBadges: Badge[]): string {
  // Get the highest existing ID number
  const existingIds = existingBadges.map(badge => badge.badgeId);
  let highestNum = 0;
  
  existingIds.forEach(id => {
    if (id.startsWith('BD_')) {
      const numPart = parseInt(id.substring(3), 10);
      if (!isNaN(numPart) && numPart > highestNum) {
        highestNum = numPart;
      }
    }
  });
  
  // Generate new ID with the next number
  return `BD_${String(highestNum + 1).padStart(3, '0')}`;
}