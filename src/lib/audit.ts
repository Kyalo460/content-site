import { prisma } from '@/lib/prisma';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
  ipAddress?: string;
}

export async function logAudit(entry: AuditLogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId,
        metadata: entry.metadata,
        ipAddress: entry.ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export const AuditActions = {
  // Auth
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  LOGIN_FAILED: 'LOGIN_FAILED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  PASSWORD_RESET: 'PASSWORD_RESET',
  
  // Media
  MEDIA_UPLOAD: 'MEDIA_UPLOAD',
  MEDIA_UPDATE: 'MEDIA_UPDATE',
  MEDIA_DELETE: 'MEDIA_DELETE',
  MEDIA_PUBLISH: 'MEDIA_PUBLISH',
  MEDIA_UNPUBLISH: 'MEDIA_UNPUBLISH',
  
  // Collections
  COLLECTION_CREATE: 'COLLECTION_CREATE',
  COLLECTION_UPDATE: 'COLLECTION_UPDATE',
  COLLECTION_DELETE: 'COLLECTION_DELETE',
  COLLECTION_PUBLISH: 'COLLECTION_PUBLISH',
  
  // Products
  PRODUCT_CREATE: 'PRODUCT_CREATE',
  PRODUCT_UPDATE: 'PRODUCT_UPDATE',
  PRODUCT_DELETE: 'PRODUCT_DELETE',
  
  // Orders
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  ORDER_REFUNDED: 'ORDER_REFUNDED',
  
  // Settings
  SETTINGS_UPDATE: 'SETTINGS_UPDATE',
  
  // Customers
  CUSTOMER_VIEW: 'CUSTOMER_VIEW',
} as const;

export type AuditAction = typeof AuditActions[keyof typeof AuditActions];