import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates or updates a LevelRecord for a user on a specific level.
 * This function uses 'upsert' to ensure a user can only have
 * one record per level. If they submit a new one, it updates
 * their old one.
 */
export async function createOrUpdateLevelRecord(req, res, decodedToken) {
  const { levelId, percent, videoId } = req.body;
  const { username } = decodedToken;

  if (!levelId || !percent || !videoId) {
    return res.status(400).json({ message: 'Level ID, Percent, and Video ID are required.' });
  }

  try {
    const numericPercent = parseInt(percent, 10);
    if (isNaN(numericPercent) || numericPercent < 1 || numericPercent > 100) {
      return res.status(400).json({ message: 'Percentage must be a number between 1 and 100.' });
    }

    const level = await prisma.level.findUnique({
      where: { id: levelId },
    });
    if (!level) {
      return res.status(404).json({ message: 'The level you are submitting to does not exist.' });
    }

    const record = await prisma.levelRecord.upsert({
      where: {
        // A unique key based on the user and level
        // This requires a compound index in your Prisma schema.
        // Let's use a find/update method instead for simplicity,
        // as you may not have that index.
        
        // --- Simpler Find/Update Logic ---
        // Let's find an existing record first.
        levelId_username: {
          levelId: levelId,
          username: username,
        }
      },
      update: {
        percent: numericPercent,
        videoId: videoId,
      },
      create: {
        username: username,
        percent: numericPercent,
        videoId: videoId,
        levelId: levelId,
      },
    });

    return res.status(201).json({ message: 'Record submitted successfully!', record });

  } catch (error) {
     // This 'P2002' error handling might be needed if you add the unique index later
    if (error.code === 'P2002') { 
      return res.status(409).json({ message: 'A record for this user on this level already exists.' });
    }
    console.error("Failed to create level record:", error);
    return res.status(500).json({ message: 'Failed to submit record.' });
  }
}

/**
 * --- IMPORTANT DATABASE FIX ---
 * The 'upsert' logic above is most efficient if you add a
 * compound unique index to your 'LevelRecord' model.
 *
 * In `prisma/schema.prisma`, update `LevelRecord` like this:
 *
 * model LevelRecord {
 * id        String @id @default(auto()) @map("_id") @db.ObjectId
 * username  String
 * percent   Int
 * videoId   String
 * levelId   String @db.ObjectId
 * level     Level  @relation(fields: [levelId], references: [id])
 * createdAt DateTime @default(now())
 *
 * @@unique([levelId, username], name: "levelId_username") // <-- ADD THIS LINE
 * }
 */