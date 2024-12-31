import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from '../models/user.model.js';


dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const authentication = async (req, res, next) =>{
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).json({ message: "No autorizado: token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token del header

  try {
      const decoded = jwt.verify(token, SECRET_KEY); // Decodificar el token
      const user = await User.findOne({_id:decoded.id, online:true}); // Buscar el usuario por ID del token

      if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado" });
      }
      // Agregar información del usuario a `req.user`
      req.user = {
          id: user._id,
          email: user.email,
          username: user.username
      };

      next(); // Continuar al siguiente middleware o controlador
  } catch (err) {
      return res.status(403).json({
          message: "Token inválido o expirado",
          error: err.message,
          line: err.line
        });
  }
}

export default authentication;