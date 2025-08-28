// Test environment variables loading
console.log('=== ENVIRONMENT VARIABLES TEST ===');
console.log('import.meta.env:', import.meta.env);
console.log('VITE_ADMIN_USERNAME:', import.meta.env.VITE_ADMIN_USERNAME);
console.log('VITE_ADMIN_PASSWORD:', import.meta.env.VITE_ADMIN_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('All VITE_ variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
console.log('==================================');

