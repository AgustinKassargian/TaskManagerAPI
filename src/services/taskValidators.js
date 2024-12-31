import { body, param, query } from "express-validator";
import { validateFields } from "../middlewares/task.middleware.js";


export const validateCreateTasks = [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').optional().isString().withMessage('La descripción debe ser un texto'),
    validateFields
];

export const validateGetTaskByID = [
    param('id').isMongoId().withMessage('El ID proporcionado no es válido'),
    validateFields
];

export const validateEditTask = [
    param('id').isMongoId().withMessage('El ID proporcionado no es válido'),
    body('title').optional().notEmpty().withMessage('El título no puede estar vacío si se envía'),
    body('description').optional().isString().withMessage('La descripción debe ser un texto'),
    body('completed').optional().isBoolean().withMessage('El campo "completed" debe ser booleano'),
    validateFields
];


export const validateDeleteTask = [
    param('id').isMongoId().withMessage('El ID proporcionado no es válido'),
    validateFields
];

export const validateGetTasks = [
    query('completed').optional().isIn(['true', 'false']).withMessage('El valor de completed debe ser "true" o "false"'),
    validateFields
];