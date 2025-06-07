/**
 * Migration script to transfer registration data from Vercel Blob to Firebase Firestore
 * 
 * Prerequisites:
 * 1. Firebase Admin SDK service account key file (firebase-service-account.json)
 * 2. Existing Vercel Blob storage with registration data
 * 
 * Usage:
 * node scripts/migrate-to-firestore.js
 */

const { get } = require('@vercel/blob');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Path to service account key file
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: Firebase service account key file not found.');
  console.error('Please create a service account key file at:', serviceAccountPath);
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();
const REGISTRATIONS_COLLECTION = 'registrations';
const REGISTRATIONS_PREFIX = 'registrations';

async function migrateData() {
  try {
    console.log('Starting migration from Vercel Blob to Firestore...');
    
    // Try to fetch data from Vercel Blob
    console.log('Fetching data from Vercel Blob...');
    let registrations = [];
    
    try {
      // Attempt to get the blob URL
      const blobUrl = `${REGISTRATIONS_PREFIX}/data.json`;
      const data = await get(blobUrl);
      
      if (!data) {
        console.log('No data found in Vercel Blob or blob not accessible.');
      } else {
        // Parse the JSON data
        const text = await data.text();
        registrations = JSON.parse(text);
        console.log(`Found ${registrations.length} registrations in Vercel Blob.`);
      }
    } catch (error) {
      console.error('Error fetching data from Vercel Blob:', error.message);
      console.log('Checking for local JSON file as fallback...');
      
      // Try to read from local JSON file as fallback
      const localFilePath = path.join(__dirname, '..', 'data', 'registrations.json');
      if (fs.existsSync(localFilePath)) {
        const data = fs.readFileSync(localFilePath, 'utf8');
        registrations = JSON.parse(data);
        console.log(`Found ${registrations.length} registrations in local JSON file.`);
      } else {
        console.log('No local JSON file found. Starting with empty registrations.');
      }
    }
    
    if (registrations.length === 0) {
      console.log('No registrations to migrate. Firestore collection will be empty.');
      return;
    }
    
    // Create a batch write to perform multiple operations atomically
    console.log('Writing data to Firestore...');
    const batch = db.batch();
    
    // First, delete all existing registrations in Firestore (if any)
    const existingDocs = await db.collection(REGISTRATIONS_COLLECTION).get();
    existingDocs.forEach(doc => {
      batch.delete(doc.ref);
    });
    console.log(`Cleared ${existingDocs.size} existing documents from Firestore.`);
    
    // Then add all the registrations
    registrations.forEach(registration => {
      const docRef = db.collection(REGISTRATIONS_COLLECTION).doc(registration.regId);
      batch.set(docRef, registration);
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log(`Successfully migrated ${registrations.length} registrations to Firestore.`);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateData();