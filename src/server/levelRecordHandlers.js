import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Creates or updates a LevelRecord for a user on a specific level.
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

    // Upsert logic: If a record exists for this user/level, update it. Otherwise create new.
    const record = await prisma.levelRecord.upsert({
      where: {
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
    // Fallback if the unique index doesn't exist yet, try a simple create
    if (error.code === 'P2002') { 
       // If unique constraint failed, it means it exists. We should try update manually if upsert failed contextually,
       // but typically upsert handles P2002. If we get here, let's just return error.
       return res.status(409).json({ message: 'A record for this user on this level already exists.' });
    }
    console.error("Failed to create level record:", error);
    return res.status(500).json({ message: 'Failed to submit record.' });
  }
}

/**
 * Removes a LevelRecord.
 * intended for Admins/Moderators.
 */
export async function removeLevelRecord(req, res) {
  const { levelId, recordVideoId } = req.body;

  if (!levelId || !recordVideoId) {
    return res.status(400).json({ message: 'Level ID and Record Video ID are required.' });
  }

  try {
    // Delete the record where the levelId AND the videoId match
    const result = await prisma.levelRecord.deleteMany({
      where: {
        levelId: levelId,
        videoId: recordVideoId,
      },
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.status(200).json({ message: 'Record removed successfully.' });
  } catch (error) {
    console.error("Failed to remove level record:", error);
    return res.status(500).json({ message: 'Failed to remove record.' });
  }
}