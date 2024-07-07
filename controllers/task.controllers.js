const Task = require('../models/task.model');

exports.createTask = async (req, res) => {
    try {
        const { title, description, status, date } = req.body;
        const task = new Task({
            title,
            description,
            status,
            date,
            owner: req.user._id,
        });
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id, isDeleted: false });
        res.send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });
        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'status', 'date'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates' });
        }

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id, isDeleted: false });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        updates.forEach((update) => (task[update] = req.body[update]));
        task.updatedAt = Date.now();
        await task.save();
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
};
