import express from 'express';
import Data from '../models/dataModel.js';

const router = express.Router();

// Retrieve all hotbar slots (copied items) for a specific user
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch copied items from MongoDB
    const copiedItems = await Data.find({ userId }).exec();
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

// Update an existing hotbar slot
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    // Update hotbar slot by its id in MongoDB
    const updatedItem = await Data.findByIdAndUpdate(
      id,
      { data },
      { new: true, runValidators: true }
    ).exec();
    res.status(200).json(updatedItem);
  } catch (err) {
    next({
      log: `😬 Error with PUT request at /hotbar/:id: ${err}`,
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
    res
      .status(200)
      .json({ message: 'Copied item has been deleted successfully' });
  } catch (err) {
    next({
      log: `👎 Error with DELETE request at /hotbar/:id: ${err}`,
      status: 500,
      message: { err: 'Failed to delete copied item' },
    });
  }
});

export default router;
