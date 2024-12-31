import pkg from 'express';
import User from '../models/user.model.js';

const { Request, Response } = pkg;

export const createUser = async (req, res) => {
    const { username,password, email } = req.body;
    try {
        let newUser = new User({
            username,
            password,
            email
        });

        await newUser.save();
        res.status(201).send({
            message: "Usuario creado correctamente",
            newUser
        });
    } catch (error) {
        res.status(500).send({
            message: "Error al crear un nuevo usuario.",
            error: error.message
        });
    }
};

export const editUser = async (req, res) => {
    let id = req.params.id;
    
    try {
        const user = await newUser.findById(id);
        if (!task) {
            return res.status(404).send('No se encontró una tarea con ese ID');
        }
        user.username = req.body.username || user.username;
        user.password = req.body.password || user.password;
        user.email = req.body.email || user.email;

        const updatedTask = await user.save();

        res.status(200).json({ message:"Tarea actualizada correctamente.", data: updatedTask });

    } catch (error) {
        res.status(500).json({
            message: "Error al editar el usuario.",
            error: error.message
        });
    }
};


