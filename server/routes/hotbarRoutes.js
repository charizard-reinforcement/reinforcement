import express from 'express';
import Data from '../models/dataModel.js';

const router = express.Router();
// Parse JSON bodies
router.use(express.json());

// Parse URL-encoded bodies
router.use(express.urlencoded({ extended: true }));

// Retrieve all hotbar slots (copied items) for a specific user
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch copied items from MongoDB
    const copiedItems = await Data.findOne({ userId }).exec();
    console.log('items', copiedItems);
    res.status(200).json(copiedItems);
  } catch (err) {
    next({
      log: `🫤 Error with GET request at /hotbar/:userId: ${err}`,
      status: 500,
      message: { err: 'Failed to retrieve copied items' },
    });
  }
});

// Update all existing hotbar slots for user
router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { data } = req.body;
    // Update hotbar slot by its id in MongoDB

    const updatedItem = await Data.findOneAndUpdate({ userId: userId }, { data: data }, { new: true, runValidators: true, upsert: true }).exec();
    console.log('upserted/updated this :');
    console.log(updatedItem);
    res.status(200).json(updatedItem);
  } catch (err) {
    next({
      log: `😬 Error with PUT request at /hotbar/:userId: ${err}`,
      status: 500,
      message: { err: 'Failed to update copied item' },
    });
  }
});

// Remove a copied item by its id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Remove slot by its id from MongoDB
    await Data.findByIdAndDelete(id).exec();
    res.status(200).json({ message: 'Copied item has been deleted successfully' });
  } catch (err) {
    next({
      log: `👎 Error with DELETE request at /hotbar/:id: ${err}`,
      status: 500,
      message: { err: 'Failed to delete copied item' },
    });
  }
});

export default router;
