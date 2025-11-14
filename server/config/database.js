/**
 * Database Configuration
 * 
 * Prisma Client singleton instance
 * Prevents multiple instances in development
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

// PrismaClient is attached to the global object in development
// This prevents hot reload issues in development
const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection test
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting database:', error);
    throw error;
  }
}

// Handle shutdown signals
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

export default prisma;

