// Migration script to transfer data from local JSON file to Vercel Blob storage

const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

// Define paths
const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const REGISTRATIONS_PREFIX = 'registrations';

async function migrateToBlob() {
  try {
    // Check if local file exists
    if (!fs.existsSync(REGISTRATIONS_FILE)) {
      console.log('No local registrations file found. Nothing to migrate.');
      return;
    }

    // Read local registrations file
    console.log('Reading local registrations file...');
    const data = fs.readFileSync(REGISTRATIONS_FILE, 'utf8');
    const registrations = JSON.parse(data);

    if (!registrations || !registrations.length) {
      console.log('No registrations found in local file. Nothing to migrate.');
      return;
    }

    console.log(`Found ${registrations.length} registrations to migrate.`);

    // Upload to Vercel Blob
    console.log('Uploading to Vercel Blob...');
    const blob = await put(`${REGISTRATIONS_PREFIX}/data.json`, JSON.stringify(registrations, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
      allowOverwrite: true,
    });

    console.log('Migration completed successfully!');
    console.log('Blob URL:', blob.url);

    // Create backup of local file
    const backupFile = path.join(DATA_DIR, 'registrations.backup.json');
    fs.copyFileSync(REGISTRATIONS_FILE, backupFile);
    console.log(`Backup created at ${backupFile}`);

    console.log('\nMigration summary:');
    console.log(`- ${registrations.length} registrations migrated`);
    console.log(`- Data stored at: ${blob.url}`);
    console.log(`- Local backup created: ${backupFile}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateToBlob();