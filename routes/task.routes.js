const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controllers');
const auth = require('../middleware/auth.middleware');
const { taskRules, validateTask } = require('../middleware/validateTaskFields');

router.post('/tasks', auth, taskRules, validateTask, taskController.createTask);
router.get('/tasks', auth, taskController.getTasks);
router.get('/tasks/:id', auth, taskController.getTaskById);
router.put('/tasks/:id', auth, taskRules, validateTask, taskController.updateTask);
router.delete('/tasks/:id', auth, taskController.deleteTask);

module.exports = router;