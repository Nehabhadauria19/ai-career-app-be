"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Analysis_1 = __importDefault(require("../models/Analysis"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/analyses — save analysis
router.post('/', auth_1.protect, async (req, res) => {
    try {
        const { fileName, resumeText, analysis, roles } = req.body;
        if (!fileName || !resumeText) {
            res.status(400).json({ error: 'fileName and resumeText are required' });
            return;
        }
        const newAnalysis = await Analysis_1.default.create({
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
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
});
// GET /api/analyses — get user history
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const analyses = await Analysis_1.default.find({ userId: req.userId })
            .select('fileName analysis createdAt')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({ success: true, history: analyses });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
});
// GET /api/analyses/:id — get single analysis
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const analysis = await Analysis_1.default.findOne({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!analysis) {
            res.status(404).json({ error: 'Analysis not found' });
            return;
        }
        res.json({ success: true, analysis });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
});
// DELETE /api/analyses/:id
router.delete('/:id', auth_1.protect, async (req, res) => {
    try {
        const analysis = await Analysis_1.default.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });
        if (!analysis) {
            res.status(404).json({ error: 'Analysis not found' });
            return;
        }
        res.json({ success: true, message: 'Deleted successfully' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        res.status(500).json({ error: message });
    }
});
exports.default = router;
