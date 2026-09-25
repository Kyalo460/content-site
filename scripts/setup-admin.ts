import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

interface SetupOptions {
  email: string;
  password: string;
  name?: string;
  skipSeed?: boolean;
}

async function setupAdmin(options: SetupOptions) {
  const { email, password, name = 'Shirlene', skipSeed = false } = options;

  console.log('🔧 Setting up admin user...');
  console.log(`   Email: ${email}`);
  console.log(`   Name: ${name}`);

  // Validate password strength
  if (password.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: {
      email,
      passwordHash,
      name,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/updated:', admin.email);

  // Generate NEXTAUTH_SECRET if not provided
  const nextAuthSecret = randomBytes(32).toString('base64url');
  console.log('\n🔐 Generated NEXTAUTH_SECRET (add to .env.local):');
  console.log(`   NEXTAUTH_SECRET="${nextAuthSecret}"`);

  if (!skipSeed) {
    console.log('\n🌱 Running database seed...');
    const { default: seed } = await import('./seed.js');
    await seed();
  }

  console.log('\n🎉 Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Add NEXTAUTH_SECRET to .env.local');
  console.log('   2. Configure STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET');
  console.log('   3. Configure AWS S3/R2 credentials');
  console.log('   4. Run: npm run dev');
  console.log('   5. Login at: http://localhost:3000/admin/login');
}

async function resetPassword(email: string, newPassword: string) {
  console.log(`🔑 Resetting password for ${email}...`);

  if (newPassword.length < 12) {
    throw new Error('Password must be at least 12 characters');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  const admin = await prisma.adminUser.update({
    where: { email },
    data: { passwordHash, loginAttempts: 0, lockedUntil: null },
  });

  console.log('✅ Password reset for:', admin.email);
}

async function createEditor(email: string, password: string, name: string) {
  console.log(`👤 Creating editor: ${email}`);

  const passwordHash = await bcrypt.hash(password, 12);

  const editor = await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      name,
      role: 'EDITOR',
    },
  });

  console.log('✅ Editor created:', editor.email);
}

async function listAdmins() {
  const admins = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: 'desc' },
  });

  console.log('\n👥 Admin Users:');
  console.table(admins);
}

async function deleteAdmin(email: string) {
  const admin = await prisma.adminUser.delete({
    where: { email },
  });
  console.log('🗑️ Deleted admin:', admin.email);
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'setup': {
        const email = args[1] || process.env.ADMIN_EMAIL || 'admin@shirlene.com';
        const password = args[2] || process.env.ADMIN_PASSWORD;
        const name = args[3] || 'Shirlene';
        
        if (!password) {
          console.error('❌ Password required: npm run setup-admin <email> <password> [name]');
          process.exit(1);
        }
        
        await setupAdmin({ email, password, name });
        break;
      }
      case 'reset-password': {
        const email = args[1];
        const password = args[2];
        
        if (!email || !password) {
          console.error('❌ Usage: npm run setup-admin reset-password <email> <new-password>');
          process.exit(1);
        }
        
        await resetPassword(email, password);
        break;
      }
      case 'create-editor': {
        const email = args[1];
        const password = args[2];
        const name = args[3] || 'Editor';
        
        if (!email || !password) {
          console.error('❌ Usage: npm run setup-admin create-editor <email> <password> [name]');
          process.exit(1);
        }
        
        await createEditor(email, password, name);
        break;
      }
      case 'list':
        await listAdmins();
        break;
      case 'delete': {
        const email = args[1];
        if (!email) {
          console.error('❌ Usage: npm run setup-admin delete <email>');
          process.exit(1);
        }
        await deleteAdmin(email);
        break;
      }
      default:
        console.log(`
🔧 Admin Setup Script

Usage:
  npm run setup-admin setup <email> <password> [name]     Create/update admin
  npm run setup-admin reset-password <email> <password>   Reset admin password
  npm run setup-admin create-editor <email> <password> [name]  Create editor
  npm run setup-admin list                                List all admins
  npm run setup-admin delete <email>                      Delete admin

Examples:
  npm run setup-admin setup admin@shirlene.com "SecurePass123!" "Shirlene"
  npm run setup-admin reset-password admin@shirlene.com "NewSecurePass123!"
  npm run setup-admin create-editor editor@shirlene.com "EditorPass123!" "Content Editor"
        `);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();