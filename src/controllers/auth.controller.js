import pkg from 'express';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const { Request, Response } = pkg;

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res) => {
    const { username,password, email } = req.body;
    const hashedPassword = (await bcrypt.hash(password, 10)).toString();
        try {
        let newUser = new User({
            username,
            password: hashedPassword,
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

export const login = async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ],
        });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        const isMatch = bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        if(user.online === true){
            return res.status(409).json({
                message: "Ya existe una sesión activa para este usuario. Por favor, cierra sesión antes de iniciar una nueva."
            });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '10h' });
        user.online = true;
        user.save();

        res.json({
            message: "Login exitoso",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token: token,
        });

    } catch (err) {
        res.status(500).json({ 
            message: "Error interno del servidor",
            error: err.message,
            line: err.line
         });
    }
};

export const logout = async (req, res)=>{
    const userId = req.user?.id
    if(!userId){
        res.status(403).json({message:'No existe una sesion iniciada'});
    }
    const user = await User.findOne({
        _id:userId,
        online: true
    });
    
    if(!user){
        res.status(403).json({message:'No existe una sesion iniciada'});
        return;
    }
    try {
        user.online = false;
        await user.save();
        res.status(200).json({message:'Sesion cerrada con exito.'})
    } catch (error) {
        res.status(500).json({message:'Error al cerrar sesion.', error:error.message})

    }
}



