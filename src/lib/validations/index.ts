import { z } from 'zod';

export const mediaUploadSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  collectionId: z.string().cuid().optional(),
  isPremium: z.boolean().default(false),
  priceCents: z.number().int().min(0).default(0),
});

export const collectionSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(2000).optional(),
  coverImage: z.string().url().optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['SINGLE_ACCESS', 'SUBSCRIPTION', 'BUNDLE']),
  priceCents: z.number().int().min(0),
  currency: z.string().length(3).default('USD'),
  isActive: z.boolean().default(true),
  mediaIds: z.array(z.string().cuid()).optional(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(100),
  siteDescription: z.string().max(500).optional(),
  heroTitle: z.string().min(1).max(200),
  heroSubtitle: z.string().max(300).optional(),
  heroImage: z.string().url().optional().nullable(),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional().nullable(),
  whatsappMessage: z.string().max(500).optional(),
  contactEmail: z.string().email().optional().nullable(),
  termsUrl: z.string().url().optional().nullable(),
  privacyUrl: z.string().url().optional().nullable(),
  refundUrl: z.string().url().optional().nullable(),
  ageGateEnabled: z.boolean(),
  ageGateMessage: z.string().max(500).optional(),
  stripePublishableKey: z.string().optional().nullable(),
  stripeSecretKey: z.string().optional().nullable(),
  stripeWebhookSecret: z.string().optional().nullable(),
  storageProvider: z.enum(['s3', 'r2']).default('s3'),
  storageBucket: z.string().optional().nullable(),
  storageRegion: z.string().optional().nullable(),
  storageAccessKey: z.string().optional().nullable(),
  storageSecretKey: z.string().optional().nullable(),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const checkoutSchema = z.object({
  productId: z.string().cuid(),
  customerEmail: z.string().email(),
  customerName: z.string().max(100).optional(),
});

export const webhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.unknown()),
  }),
});