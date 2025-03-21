import { PrismaClient } from '@prisma/client';

const prismaClientSingelton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingelton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingelton()

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;