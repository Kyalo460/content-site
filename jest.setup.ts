import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

Object.defineProperty(window, 'sessionStorage', {
  writable: true,
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
});

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    adminUser: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    media: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    collection: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
    },
    customer: {
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    entitlement: {
      findUnique: jest.fn(),
      create: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
    siteSettings: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  },
}));

jest.mock('@/lib/storage', () => ({
  uploadFile: jest.fn().mockResolvedValue('test/key.jpg'),
  getSignedDownloadUrl: jest.fn().mockResolvedValue('https://signed-url.com/file.jpg'),
  getSignedUploadUrl: jest.fn().mockResolvedValue('https://signed-upload-url.com'),
  deleteFile: jest.fn().mockResolvedValue(undefined),
  generateStorageKey: jest.fn().mockReturnValue('test/key.jpg'),
  validateFile: jest.fn().mockReturnValue({ valid: true }),
  getMediaType: jest.fn().mockReturnValue('IMAGE'),
  ALLOWED_MIME_TYPES: {
    image: ['image/jpeg', 'image/png', 'image/webp'],
    video: ['video/mp4', 'video/webm'],
  },
  MAX_FILE_SIZE: 50 * 1024 * 1024,
}));

jest.mock('@/lib/media', () => ({
  generateImageThumbnail: jest.fn().mockResolvedValue(Buffer.from('thumb')),
  generateBlurredPreview: jest.fn().mockResolvedValue(Buffer.from('preview')),
  generateVideoThumbnail: jest.fn().mockResolvedValue(Buffer.from('thumb')),
  getVideoMetadata: jest.fn().mockResolvedValue({ duration: 60, width: 1920, height: 1080 }),
  optimizeImage: jest.fn().mockResolvedValue(Buffer.from('optimized')),
  getFileExtension: jest.fn().mockReturnValue('jpg'),
}));

jest.mock('@/lib/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ id: 'cs_test', url: 'https://checkout.stripe.com/test' }),
      },
    },
    customers: {
      create: jest.fn().mockResolvedValue({ id: 'cus_test' }),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    paymentIntents: {
      retrieve: jest.fn(),
    },
    products: {
      create: jest.fn(),
    },
    prices: {
      create: jest.fn(),
    },
  },
  createCheckoutSession: jest.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/test' }),
  createCustomer: jest.fn().mockResolvedValue({ id: 'cus_test' }),
  constructWebhookEvent: jest.fn(),
  getPaymentIntent: jest.fn(),
  createProduct: jest.fn(),
  createPrice: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  auth: jest.fn().mockResolvedValue(null),
  handlers: { GET: jest.fn(), POST: jest.fn() },
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('next-auth', () => ({
  ...jest.requireActual('next-auth'),
  getServerSession: jest.fn().mockResolvedValue(null),
}));

console.error = jest.fn();
console.warn = jest.fn();