import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/user.model.js';


dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authentication = async (req, res, next) =>{

    const {authToken} = req.cookies;

    if (!authToken) {
        return res.status(401).json({ message: "No autorizado: token no proporcionado" });
    }
    
  try {
       const userProvided = jwt.verify(authToken, SECRET_KEY, (err,user)=>{
        if(err){
             return res.status(403).json({message: "Token invalido"});
        }
        return user;
    })
        const userFounded = await User.findOne({_id:userProvided.id});
        if (!userFounded) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }
        req.user = {
        id: userFounded._id,
        email: userFounded.email,
        username: userFounded.username
        
    }
    next();
} catch (err) {
      return res.status(403).json({
          message: "Token inválido o expirado",
          error: err.message,
          line: err.line
        });
  }
}

export default authentication;