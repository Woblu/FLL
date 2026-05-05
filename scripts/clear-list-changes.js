/**
 * One-time / maintenance: deletes all ListChange documents (position + list audit log).
 * Run: npm run clear-list-changes
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const result = await prisma.listChange.deleteMany({});
  console.log(`Deleted ${result.count} list change record(s).`);
} catch (e) {
  console.error(e);

} finally {
  await prisma.$disconnect();
}
