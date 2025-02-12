const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Event = require('../models/Event');

module.exports = (io) => {
    // Create Event (POST request)
    router.post('/', auth, async (req, res) => {
        try {
            const { name, description, date, category } = req.body;
            const event = new Event({ name, description, date, category, owner: req.user.id });
            await event.save();

            // Emit the new event to all clients
            io.emit('newEvent', event);

            res.status(201).json(event);
        } catch (err) {
            res.status(400).json({ error: 'Failed to create event', details: err });
        }
    });

    // Get All Events (GET request)
    router.get('/', auth, async (req, res) => {
        try {
            const { category, startDate, endDate, search } = req.query;
            let filter = {owner :  req.user.id };

            if (category) {
                filter.category = category;
            }
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                ];
            }
            if (startDate || endDate) {
                filter.date = {};
                if (startDate) filter.date.$gte = new Date(startDate);
                if (endDate) filter.date.$lte = new Date(endDate);
            }

            const events = await Event.find(filter);
            res.json(events);
        } catch (err) {
            res.status(400).json({ error: 'Failed to fetch events', details: err });
        }
    });

    //Delete Specific Event
    router.delete('/:id', auth, async (req, res) => {
        const id = req.params.id
        try {

            const result = await Event.findByIdAndDelete(id);

            if (!result) return res.status(404).json({ message: `Item with id ${id} not found.` });
            return res.status(200).json({ message: `Event Deleted` });

        } catch (error) {
            return res.status(400).json({ error: 'Error deleting item.', details: error });
        }
    })


    //Update Specific Event
    router.put('/:id', auth, async (req, res) => {
        const id = req.params.id
        const updateData = req.body

        try {
            const result = await Event.findByIdAndUpdate(id, updateData, { new: true })

            if (!result) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'User updated successfully',
                updatedUser: result,
            });

        } catch (error) {
            return res.status(500).json({ message: 'Error updating user' });
        }

    })

    return router;
};
