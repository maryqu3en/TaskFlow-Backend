const { check, validationResult } = require('express-validator');

const taskRules = [
    check('title').not().isEmpty().withMessage('Title is required'),
    check('description').optional().isString().withMessage('Description must be a string'),
    check('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
    check('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
];

const validateTask = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    taskRules,
    validateTask,
};
