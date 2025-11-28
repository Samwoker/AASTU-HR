import axios from 'axios';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Base URL for Cloudinary Image Upload API
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file object to upload
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadFile = async (file) => {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('Cloudinary configuration missing');
    throw new Error('Cloudinary configuration missing. Please check your .env file.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY); // Usually not needed for unsigned uploads, but keeping reference

  try {
    const response = await axios.post(CLOUDINARY_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    throw error;
  }
};

export default {
  uploadFile,
};
