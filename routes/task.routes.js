const express = require("express");
const router = express.Router();
const task = require("../models/task.model");
const auth = require('../middleware/auth.middleware');

// new task
router.post('/tasks', auth, async (req, res) => {
    try{
        const Task = new task({
            ...req.body,
            owner: req.user._id
        });
        await Task.save();
        res.status(201).send(Task);
    } catch (Task) {
        res.status(400).send(Task);
    }
});

// get tasks
router.get('/tasks', auth, async (req, res) => {
    try {
        const Task = await task.find({ owner: req.user._id });
        res.status(200).send(Task);
    } catch {
        res.status(500).send();
    }
});

// get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const Task = await task.findOne({ _id: req.params.id, owner: req.user._id });
        if(!Task){
            res.status(404).send();
        }
        res.status(200).send(Task);
    } catch {
        res.status(500).send();
    }
});

// update task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["title", "description", "status", "date"];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({error: "Invalid updates!"});
    }

    try {
        const Task = await task.findOne({ _id: req.params.id, owner: req.user._id });

        if(!Task){
            return res.status(404).send();
        }

        updates.forEach((update) => Task[update] = req.body[update]);
        await Task.save();
        res.send(Task);
    } catch {
        res.status(400).send();
    }
});

// delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const Task = await task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if(!Task){
            return res.status(404).send();
        }
        res.send(Task);
    } catch {
        res.status(500).send();
    }
});

module.exports = router;