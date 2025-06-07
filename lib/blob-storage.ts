import { put, list, del } from '@vercel/blob';

// Type for registration data
export type Registration = {
  regId: string;
  influencerId: string;
  email: string;
  name?: string;
  registeredAt: string;
};

// Prefix for registration data in blob storage
const REGISTRATIONS_PREFIX = 'registrations';

/**
 * Save registrations data to Vercel Blob
 * @param registrations Array of registration objects
 * @returns URL of the stored blob
 */
export async function saveRegistrationsToBlob(registrations: Registration[]) {
  try {
    // Convert registrations array to JSON string
    const data = JSON.stringify(registrations, null, 2);
    
    // Store in Vercel Blob with a consistent pathname
    const blob = await put(`${REGISTRATIONS_PREFIX}/data.json`, data, {
      access: 'public',
      addRandomSuffix: false, // Use consistent name for easy retrieval
      contentType: 'application/json',
      allowOverwrite: true, // Allow overwriting the existing file
    });
    
    return blob.url;
  } catch (error) {
    console.error('Error saving registrations to blob:', error);
    throw error;
  }
}

/**
 * Load registrations data from Vercel Blob
 * @returns Array of registration objects
 */
export async function loadRegistrationsFromBlob(): Promise<Registration[]> {
  try {
    // List blobs with the registrations prefix
    const { blobs } = await list({
      prefix: `${REGISTRATIONS_PREFIX}/`,
    });
    
    // Find the data.json blob
    const dataBlob = blobs.find(blob => blob.pathname === `${REGISTRATIONS_PREFIX}/data.json`);
    
    if (!dataBlob) {
      // No registrations data found, return empty array
      return [];
    }
    
    // Fetch the JSON data
    const response = await fetch(dataBlob.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch registrations data: ${response.statusText}`);
    }
    
    // Parse and return the registrations data
    const data = await response.json();
    return data as Registration[];
  } catch (error) {
    console.error('Error loading registrations from blob:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Delete a specific registration blob by ID
 * This is not used directly as we're storing all registrations in one blob,
 * but included for future flexibility
 */
export async function deleteRegistrationBlob(pathname: string) {
  try {
    await del(pathname);
    return true;
  } catch (error) {
    console.error('Error deleting registration blob:', error);
    return false;
  }
}