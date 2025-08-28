import bcrypt from 'bcryptjs';

// Secure admin credentials with hashed passwords
const ADMIN_CREDENTIALS = {
  // Username: admin@jozefmarkt.com
  // Password: JozefMarkt2024!Secure
  username: 'admin@jozefmarkt.com',
  passwordHash: '$2b$12$/xA9DqjaNVd2lsmiSjShxeQw9Abmzv5JGysgQZZke2uOtYMFplIre'
};

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
