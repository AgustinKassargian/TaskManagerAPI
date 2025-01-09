import pkg from 'express';
import Task from '../models/task.model.js';
import mongoose from 'mongoose';

const { Request, Response } = pkg;

export const createTask = async (req, res) => {
    const { title, description } = req.body;

    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).send({
            message: "No se pudo identificar al usuario para asociar la tarea"
        });
    }

    try {
        // Crear la nueva tarea asociada al usuario
        let newTask = new Task({
            title,
            description,
            createdBy: userId // Asociar la tarea al usuario
        });

        await newTask.save();
        res.status(201).send({
            message: "Tarea creada correctamente",
            newTask
        });
    } catch (error) {
        res.status(500).send({
            message: "Error al crear una nueva tarea.",
            error: error.message
        });
    }
};



export const getTasks = async (req, res) => {
    try {
        const { completed } = req.query;

        if (completed !== undefined) {
            const tasks = await Task.find({completed});
            res.status(200).json({data:tasks});
        }
        else{ 
            const tasks = await Task.find();
            res.status(200).json({data:tasks});

        }
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener tareas.",
            error: error.message
        });
    }
};


export const getTaskByID = async(req, res)=>{
    try {
        let taskId = req.params.id
        const task = await Task.findById(taskId);
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener tareas.",
            error: error.message
        });
    }
};

export const getMyTasks = async(req, res)=>{
    try {
        let userId = req.user.id
        const tasks = await Task.find({
            createdBy: userId
        });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener tareas.",
            error: error.message
        });
    }
};

export const editTask = async (req, res) => {
    let taskId = req.params.id;
    
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send('No se encontró una tarea con ese ID');
        }
        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

        const updatedTask = await task.save();

        res.status(200).json({ message:"Tarea actualizada correctamente.", data: updatedTask });

    } catch (error) {
        res.status(500).json({
            message: "Error al editar la tarea.",
            error: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).send('No se encontró una tarea con ese ID');
        }

        await task.deleteOne();

        res.status(200).json({ message: 'Tarea eliminada correctamente' });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar la tarea.",
            error: error.message
        });
    }
};

export const cleanMyTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await Task.deleteMany({
            createdBy: userId,
            completed: true
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No se encontraron tareas completadas para eliminar.' });
        }

        res.status(200).json({ message: `${result.deletedCount} tarea(s) eliminada(s) correctamente.` });
        
    } catch (error) {
        console.error(error); 
        res.status(500).json({
            message: "Error al limpiar tareas.",
            error: error.message
        });
    }
};
