import express from 'express';
import mongoose from 'mongoose';
import Data from '../models/dataModel.js';

const router = express.Router();

// Retrieve all hotbar slots (copied items) for a specific user
router.get('/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        // Fetch copied items from MongoDB
        const copiedItems = await Data.find({ userId }).exec();
        res.status(200).json(copiedItems);
    } catch (err) {
        next({
            log: 'Error with GET request: ' + err,
            status: 500,
            message: { err: 'Failed to retrieve copied items' },
        });
    }
});

// Update an existing hotbar slot
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { /*//*/ } = req.body;
        // Update hotbar slot by its id in MongoDB
        await req.db.// insert updateOne logic here based on mongodb structure
        res.status(200).json({ message: 'Hotbar slot has been updated' });
    } catch (err) {
        next({
            log: 'Error with PUT request: ' + err,
            status: 500,
            message: { err: 'Failed to update hotbar slot' },
        });
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        // Remove slot by its id from MongoDB
        await req.db// insert deleteOne logic here based on mongodb structure
    }
})


export default router;