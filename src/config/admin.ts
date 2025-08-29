export const adminConfig = {
  username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
  password: import.meta.env.VITE_ADMIN_PASSWORD || '',
  // Add other admin settings here
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxLoginAttempts: 5,
};


