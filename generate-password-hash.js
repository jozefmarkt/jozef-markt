import bcrypt from 'bcryptjs';
import readline from 'readline';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Password Hash Generator for Admin Credentials\n');
console.log('This tool will generate a secure bcrypt hash for your admin password.');
console.log('Use this hash in src/utils/security.ts\n');

// Function to generate hash
async function generateHash(password) {
  try {
    const saltRounds = 12; // Same as used in security.ts
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    return null;
  }
}

// Get password from user
rl.question('Enter the new admin password: ', async (password) => {
  if (!password || password.length < 8) {
    console.log('❌ Password must be at least 8 characters long.');
    rl.close();
    return;
  }

  console.log('\n⏳ Generating secure hash...');
  
  const hash = await generateHash(password);
  
  if (hash) {
    console.log('\n✅ Password hash generated successfully!');
    console.log('\n📋 Copy this hash to src/utils/security.ts:');
    console.log('─'.repeat(60));
    console.log(hash);
    console.log('─'.repeat(60));
    console.log('\n🔧 Update the ADMIN_CREDENTIALS object in src/utils/security.ts:');
    console.log(`passwordHash: '${hash}'`);
    console.log('\n⚠️  Keep this password safe - the hash cannot be reversed!');
  } else {
    console.log('❌ Failed to generate hash.');
  }
  
  rl.close();
});

// Handle Ctrl+C gracefully
rl.on('SIGINT', () => {
  console.log('\n\n👋 Password hash generation cancelled.');
  process.exit(0);
});
