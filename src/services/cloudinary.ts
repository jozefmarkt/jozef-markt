// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'your-cloud-name'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'your-upload-preset'; // Replace with your upload preset

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<string> => {
    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data: CloudinaryResponse = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      
      // Fallback: convert to data URL for local storage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  },

  deleteImage: async (publicId: string): Promise<void> => {
    try {
      // Note: This would require server-side implementation for security
      // For now, we'll just log the deletion
      console.log('Image deletion requested for:', publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
    }
  },

  // Helper function to extract public_id from URL
  getPublicIdFromUrl: (url: string): string | null => {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
        return urlParts[uploadIndex + 2].split('.')[0];
      }
      return null;
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return null;
    }
  },
};

export default cloudinaryService; 