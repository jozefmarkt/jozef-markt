import bcrypt from 'bcryptjs';

// Admin credentials - stored in a separate config file to avoid encoding issues
const ADMIN_CREDENTIALS = {
  username: 'admin@jozefmarkt.com',
  passwordHash: '$2b$12$Kocy28W9iV6DBHDvqATINOqcs3i04so0xQcwltM.uoBpbK50bnvum'
};

// Alternative: Read from a simple text file (Windows-friendly)
// Create a file called 'admin-config.txt' in your project root with:
// username=admin@jozefmarkt.com
// passwordHash=$2b$12$Kocy28W9iV6DBHDvqATINOqcs3i04so0xQcwltM.uoBpbK50bnvum

export const validateAdminCredentials = async (username: string, password: string): Promise<boolean> => {
  try {
    // Check username
    if (username !== ADMIN_CREDENTIALS.username) {
      return false;
    }

    // Verify password against hash
    const isValid = await bcrypt.compare(password, ADMIN_CREDENTIALS.passwordHash);
    return isValid;
  } catch (error) {
    console.error('Security validation error:', error);
    return false;
  }
};

// Utility function to generate password hash (for setup only)
export const generatePasswordHash = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};
