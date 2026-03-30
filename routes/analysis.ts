import { Router, Response } from 'express';
import Analysis from '../models/Analysis';
import { protect, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/analyses — save analysis
router.post('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName, resumeText, analysis, roles } = req.body;

    if (!fileName || !resumeText) {
      res.status(400).json({ error: 'fileName and resumeText are required' });
      return;
    }

    const newAnalysis = await Analysis.create({
      userId: req.userId,
      fileName,
      resumeText,
      analysis: analysis || null,
      roles: roles || null,
    });

    res.status(201).json({
      success: true,
      id: newAnalysis._id,
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
});

// GET /api/analyses — get user history
router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .select('fileName analysis createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, history: analyses });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
});

// GET /api/analyses/:id — get single analysis
router.get('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    res.json({ success: true, analysis });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
});

// DELETE /api/analyses/:id
router.delete('/:id', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    res.json({ success: true, message: 'Deleted successfully' });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: message });
  }
});

export default router;