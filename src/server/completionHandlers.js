import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * (USER) Creates a new completion submission for a level
 */
export async function createCompletionSubmission(req, res, decodedToken) {
  const { levelId, levelName, placement, player, percent, videoUrl } = req.body;
  
  if (!levelId || !levelName || !placement || !player || !percent || !videoUrl) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (percent !== 100) {
    return res.status(400).json({ message: 'Completion submissions must be 100%.' });
  }

  try {
    // Check if level exists
    const level = await prisma.level.findUnique({
      where: { id: levelId }
    });

    if (!level) {
      return res.status(404).json({ message: 'Level not found.' });
    }

    // Check if player already has a completion record for this level
    const existingRecord = await prisma.levelRecord.findFirst({
      where: {
        levelId: levelId,
        username: player
      }
    });

    if (existingRecord) {
      return res.status(400).json({ message: 'You already have a completion record for this level.' });
    }

    // Create the completion record
    const newRecord = await prisma.levelRecord.create({
      data: {
        username: player,
        percent: percent,
        videoId: videoUrl,
        levelId: levelId
      }
    });

    // Fetch the updated level with records
    const updatedLevel = await prisma.level.findUnique({
      where: { id: levelId },
      include: {
        records: true
      }
    });

    return res.status(201).json({ 
      message: 'Completion submitted successfully!',
      level: updatedLevel
    });
  } catch (error) {
    console.error('Create completion submission error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * (USER) Lists all completion submissions for a user
 */
export async function listUserCompletions(req, res, decodedToken) {
  try {
    const { list } = req.query; // Optional list filter
    
    const whereClause = {
      username: decodedToken.username
    };
    
    const completions = await prisma.levelRecord.findMany({
      where: whereClause,
      include: {
        level: {
          select: {
            id: true,
            name: true,
            placement: true,
            creator: true,
            verifier: true,
            list: true
          }
        }
      },
      orderBy: {
        level: {
          placement: 'asc'
        }
      }
    });

    // Filter by list if provided
    let filteredCompletions = completions;
    if (list) {
      filteredCompletions = completions.filter(record => record.level.list === list);
    }

    // Transform the data to match the expected format
    const transformedCompletions = filteredCompletions.map(record => ({
      id: record.level.id,
      name: record.level.name,
      placement: record.level.placement,
      creator: record.level.creator,
      verifier: record.level.verifier,
      list: record.level.list,
      records: [{
        username: record.username,
        percent: record.percent,
        videoId: record.videoId
      }]
    }));

    return res.status(200).json(transformedCompletions);
  } catch (error) {
    console.error('List user completions error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * (PUBLIC) Lists all completion records for a specific list (for leaderboard)
 */
export async function listAllCompletionsForList(req, res) {
  try {
    const { list } = req.query;
    
    if (!list) {
      return res.status(400).json({ message: 'List parameter is required.' });
    }

    const records = await prisma.levelRecord.findMany({
      where: {
        level: {
          list: list
        }
      },
      include: {
        level: {
          select: {
            id: true,
            name: true,
            placement: true,
            creator: true,
            verifier: true,
            list: true
          }
        }
      },
      orderBy: {
        level: {
          placement: 'asc'
        }
      }
    });

    // Group records by level
    const levelsMap = new Map();
    records.forEach(record => {
      const levelId = record.level.id;
      if (!levelsMap.has(levelId)) {
        levelsMap.set(levelId, {
          id: record.level.id,
          name: record.level.name,
          placement: record.level.placement,
          creator: record.level.creator,
          verifier: record.level.verifier,
          list: record.level.list,
          records: []
        });
      }
      levelsMap.get(levelId).records.push({
        username: record.username,
        percent: record.percent,
        videoId: record.videoId
      });
    });

    return res.status(200).json(Array.from(levelsMap.values()));
  } catch (error) {
    console.error('List all completions for list error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * (ADMIN) Lists all completion submissions for moderation
 */
export async function listAllCompletions(req, res) {
  try {
    const completions = await prisma.level.findMany({
      include: {
        records: true
      },
      orderBy: {
        placement: 'asc'
      }
    });

    return res.status(200).json(completions);
  } catch (error) {
    console.error('List all completions error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

/**
 * (ADMIN) Removes a completion record from a level
 */
export async function removeCompletionRecord(req, res) {
  const { levelId, username } = req.body;
  
  if (!levelId || !username) {
    return res.status(400).json({ message: 'Level ID and username are required.' });
  }

  try {
    // Find and delete the specific record
    const deletedRecord = await prisma.levelRecord.deleteMany({
      where: {
        levelId: levelId,
        username: username
      }
    });

    if (deletedRecord.count === 0) {
      return res.status(404).json({ message: 'Completion record not found.' });
    }

    return res.status(200).json({ message: 'Completion record removed successfully.' });
  } catch (error) {
    console.error('Remove completion record error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
