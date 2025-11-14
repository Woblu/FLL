import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function addLevelToList(req, res) {
  const { levelData, list, placement } = req.body;
  if (!levelData || !list || placement === undefined || !levelData.name || !levelData.creator || !levelData.verifier || !levelData.videoId || !levelData.levelId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newLevel = await prisma.$transaction(async (tx) => {
      await tx.level.updateMany({ where: { list, placement: { gte: placement } }, data: { placement: { increment: 1 } } });
      const dataToCreate = { ...levelData, levelId: parseInt(levelData.levelId, 10), placement: parseInt(placement, 10), list };
      const createdLevel = await tx.level.create({ data: dataToCreate });

      await tx.listChange.create({
        data: {
          type: 'ADD',
          description: `${createdLevel.name} added to the ${list} at #${placement}`,
          list: list,
          level: { connect: { id: createdLevel.id } },
        },
      });

      const limit = list === 'main-list' ? 150 : 75;
      await tx.level.deleteMany({ where: { list, placement: { gt: limit } } });
      return createdLevel;
    });
    return res.status(201).json(newLevel);
  } catch (error) {
    console.error("Failed to add level to list:", error);
    return res.status(500).json({ message: 'Failed to add level.' });
  }
}

export async function removeLevelFromList(req, res) {
  const { levelId } = req.body;
  if (!levelId) { return res.status(400).json({ message: 'Missing required field: levelId.' }); }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const levelToRemove = await tx.level.findUnique({ where: { id: levelId } });
      if (!levelToRemove) throw new Error('Level not found.');

      await tx.listChange.create({
        data: {
          type: 'REMOVE',
          description: `${levelToRemove.name} removed from ${levelToRemove.list} (was #${levelToRemove.placement})`,
          list: levelToRemove.list,
          level: { connect: { id: levelToRemove.id } },
        },
      });

      // --- THIS IS THE FIX ---
      // Delete all records associated with this level first
      await tx.levelRecord.deleteMany({ where: { levelId: levelId } });
      // --- END OF FIX ---

      // Now we can safely delete the level
      await tx.level.delete({ where: { id: levelId } });
      
      await tx.level.updateMany({ where: { list: levelToRemove.list, placement: { gt: levelToRemove.placement } }, data: { placement: { decrement: 1 } } });
      return { message: `${levelToRemove.name} removed successfully.` };
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Failed to remove level from list:", error);
    return res.status(500).json({ message: error.message || 'Failed to remove level.' });
  }
}

export async function moveLevelInList(req, res) {
  const { levelId, newPlacement } = req.body;
  if (!levelId || newPlacement === undefined) { return res.status(400).json({ message: 'Missing fields: levelId or newPlacement.' }); }
  try {
    const updatedLevel = await prisma.$transaction(async (tx) => {
      const levelToMove = await tx.level.findUnique({ where: { id: levelId } });
      if (!levelToMove) throw new Error('Level not found');
      const oldPlacement = levelToMove.placement;
      const { list } = levelToMove;

      if (oldPlacement !== newPlacement) {
        if (oldPlacement > newPlacement) {
          await tx.level.updateMany({ where: { list, placement: { gte: newPlacement, lt: oldPlacement } }, data: { placement: { increment: 1 } } });
        } else {
          await tx.level.updateMany({ where: { list, placement: { gt: oldPlacement, lte: newPlacement } }, data: { placement: { decrement: 1 } } });
        }
      }
      
      const finalUpdatedLevel = await tx.level.update({ where: { id: levelId }, data: { placement: newPlacement } });

      if (oldPlacement !== newPlacement) {
        await tx.listChange.create({
          data: {
            type: 'MOVE',
            description: `${finalUpdatedLevel.name} moved from #${oldPlacement} to #${newPlacement}`,
            list: list,
            level: { connect: { id: finalUpdatedLevel.id } },
          },
        });
      }

      const limit = list === 'main-list' ? 150 : 75;
      await tx.level.deleteMany({ where: { list, placement: { gt: limit } } });
      return finalUpdatedLevel;
    });
    return res.status(200).json(updatedLevel);
  } catch (error) {
    console.error("Failed to move level in list:", error);
    return res.status(500).json({ message: error.message || 'Failed to move level.' });
  }
}

export async function updateLevel(req, res) {
  const { levelId, levelData } = req.body;
  if (!levelId || !levelData) { return res.status(400).json({ message: 'Level ID and level data are required.' }); }
  try {
    const updatedLevel = await prisma.level.update({
      where: { id: levelId },
      data: {
        name: levelData.name,
        creator: levelData.creator,
        verifier: levelData.verifier,
        videoId: levelData.videoId,
        levelId: levelData.levelId ? parseInt(levelData.levelId, 10) : null,
        // Also add thumbnailUrl here if you make an admin "edit" page
        thumbnailUrl: levelData.thumbnailUrl || null, 
      },
    });
    return res.status(200).json(updatedLevel);
  } catch (error) {
    console.error("Failed to update level:", error);
    return res.status(500).json({ message: 'Failed to update level.' });
  }
}

export async function getLevelHistory(req, res, levelId) {
    if (!levelId) { return res.status(400).json({ message: 'Level ID is required.' }); }
    try {
        const history = await prisma.listChange.findMany({
            where: { levelId: levelId },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(history);
    } catch (error) {
        console.error("Failed to fetch level history:", error);
        return res.status(500).json({ message: 'Failed to fetch level history.' });
    }
}

export async function getHistoricList(req, res) {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'A date parameter is required.' });
  }
  try {
    const targetDate = new Date(date);
    const currentLevels = await prisma.level.findMany({ where: { list: 'main-list' } });
    const levelsMap = new Map(currentLevels.map(level => [level.id, { ...level }]));
    const changesToUndo = await prisma.listChange.findMany({
      where: { list: 'main-list', createdAt: { gt: targetDate } },
      orderBy: { createdAt: 'desc' },
    });
    for (const change of changesToUndo) {
      if (change.type === 'ADD') {
        levelsMap.delete(change.levelId);
      } 
      else if (change.type === 'MOVE') {
        const match = change.description.match(/moved from #(\d+) to #(\d+)/);
        if (match) {
          const oldPlacement = parseInt(match[1]);
          const levelToRevert = levelsMap.get(change.levelId);
          if (levelToRevert) { levelToRevert.placement = oldPlacement; }
        }
      } 
      else if (change.type === 'REMOVE') {
        const match = change.description.match(/(.+) removed from .+ \(was #(\d+)\)/);
        if (match) {
          const [, levelName, oldPlacementStr] = match;
          levelsMap.set(change.levelId, {
            id: change.levelId,
            name: levelName,
            placement: parseInt(oldPlacementStr),
            creator: 'N/A (Historic)',
            verifier: 'N/A',
            list: 'main-list',
          });
        }
      }
    }
    let finalHistoricList = Array.from(levelsMap.values()).sort((a, b) => a.placement - b.placement);
    finalHistoricList.forEach((level, index) => { level.placement = index + 1; });
    return res.status(200).json(finalHistoricList);
  } catch (error) {
    console.error("Failed to get historic list:", error);
    return res.status(500).json({ message: 'Failed to retrieve historic list data.' });
  }
}

export async function createLevelByUser(req, res, decodedToken) {
  const { levelName, levelId, videoId, list, attempts, thumbnailUrl } = req.body;
  if (!levelName || !levelId || !videoId || !list) {
    return res.status(400).json({ message: 'Level Name, Level ID, Video ID, and List are required.' });
  }
  const { username } = decodedToken;
  try {
    const lastLevel = await prisma.level.findFirst({
      where: { list: list },
      orderBy: { placement: 'desc' },
    });
    const newPlacement = lastLevel ? lastLevel.placement + 1 : 1;
    const newLevel = await prisma.level.create({
      data: {
        name: levelName,
        levelId: parseInt(levelId, 10),
        videoId: videoId,
        creator: username,
        verifier: username,
        placement: newPlacement,
        list: list,
        attempts: attempts ? parseInt(attempts, 10) : null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });
    return res.status(201).json(newLevel);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'A level with this Level ID already exists on the list.' });
    }
    console.error("Failed to create level by user:", error);
    return res.status(500).json({ message: 'Failed to add level.' });
  }
}