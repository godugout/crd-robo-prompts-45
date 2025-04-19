
// This script helps with initial Prisma setup
const { exec } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔹 Prisma Database Setup 🔹');
console.log('This script will help you set up your PostgreSQL database with Prisma.\n');

// Ask for database connection details
rl.question('Enter your PostgreSQL database URL (e.g., postgresql://username:password@localhost:5432/dbname): ', (dbUrl) => {
  
  // Create .env file with database URL
  const fs = require('fs');
  fs.writeFileSync('.env', `DATABASE_URL="${dbUrl}"\n`);
  
  console.log('\n✅ Created .env file with database connection string');
  console.log('🔄 Running Prisma migrations...');
  
  // Run Prisma migrate
  exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      console.log('\nTroubleshooting:');
      console.log('1. Make sure PostgreSQL is running');
      console.log('2. Check that the database URL is correct');
      console.log('3. Ensure the database exists');
      console.log('\nYou can run migrations manually with: npx prisma migrate dev');
      rl.close();
      return;
    }
    
    console.log(stdout);
    console.log('✅ Database setup complete!');
    console.log('\nNext steps:');
    console.log('1. Generate Prisma client: npx prisma generate');
    console.log('2. Explore your database: npx prisma studio');
    
    rl.close();
  });
});
