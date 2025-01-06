import express from 'express';

const router = express.Router();

// Retrieve all hotbar slots (copied items)
router.get('/' async (req, res, next) => {
    try {

    } catch (err) {
        next({
            log: 'Error with GET request: ' + err,
            status: 500,
            message: { err: 'Failed to retrieve copied items' },
        });
    }
});

// Update an existing hotbar slot