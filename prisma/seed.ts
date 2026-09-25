import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shirlene.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Shirlene',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Shirlene',
      siteDescription: 'Premium creator platform',
      heroTitle: 'Shirlene',
      heroSubtitle: 'Exclusive content & experiences',
      whatsappMessage: 'Hi Shirlene! I\'d love to connect.',
      ageGateEnabled: true,
      ageGateMessage: 'This site contains mature content. You must be 18+ to enter.',
      storageProvider: 's3',
    },
  });

  console.log('✅ Site settings created');

  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: 'intimate-moments' },
      update: {},
      create: {
        name: 'Intimate Moments',
        slug: 'intimate-moments',
        description: 'Personal and artistic photography',
        sortOrder: 1,
        isPublished: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'behind-scenes' },
      update: {},
      create: {
        name: 'Behind the Scenes',
        slug: 'behind-scenes',
        description: 'Exclusive behind-the-scenes content',
        sortOrder: 2,
        isPublished: true,
      },
    }),
    prisma.collection.upsert({
      where: { slug: 'video-diaries' },
      update: {},
      create: {
        name: 'Video Diaries',
        slug: 'video-diaries',
        description: 'Personal video journals and stories',
        sortOrder: 3,
        isPublished: false,
      },
    }),
  ]);

  console.log('✅ Sample collections created');
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });