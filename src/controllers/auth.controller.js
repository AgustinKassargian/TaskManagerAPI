import pkg from 'express';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import createAccessToken from '../services/jwt.js';
import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

const { Request, Response } = pkg;

dotenv.config();

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
        const token = await createAccessToken({id: newUser._id})
        res.cookie('authToken', token,{
            sameSite:'none',
            secure: true,
            httpOnly: false
        })
        res.status(201).send({
            message: "Usuario creado correctamente",
            newUser:{
                username,
                email
            }
        });
    } catch (error) {
        res.status(500).send({
            message: "Error al crear un nuevo usuario.",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { email: username },
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

        const token = await createAccessToken({id: user._id})
        res.cookie('authToken', token,{
            sameSite:'none',
            secure: true,
            httpOnly: false
        })
        res.status(200).json({
            message: "Login exitoso",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                token: token
            },
            });

    } catch (err) {
        res.status(500).json({ 
            message: "Error interno del servidor",
            error: err.message,
            line: err.line
         });
    }
};

export const logout = async (req, res) => {
    try {
        const authToken = req.cookies.authToken;
        if (!authToken) {
            return res.status(200).json({ message: 'Sesión cerrada con éxito.' });
        }
        res.clearCookie('authToken');
        res.status(200).json({ message: 'Sesión cerrada con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión.', error: error.message });
    }
};


export const verify = async (req, res) => {
    const {authToken} = req.cookies

    if(!authToken) res.status(401).json({message:'No autorizado: token no proporcionado'})

    const SECRET_KEY = process.env.SECRET_KEY
    jwt.verify(authToken, SECRET_KEY, async (err, user) => {
        if(err) return res.status(401).json({message:'No autorizado: token invalido'})
        const userFounded = await User.findById(user.id);
        if(!userFounded) return res.status(401).json({message:'No autorizado: Usuario no encontrado'});
        return res.status(200).json({
            id: userFounded._id,
            email: userFounded.email,
            username: userFounded.username
        })
    })
}



