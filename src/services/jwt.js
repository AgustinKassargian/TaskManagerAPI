import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const createAccessToken = (payload) => {
    return new Promise((resolve, reject)=>{
        jwt.sign(
            payload,
            SECRET_KEY,
            {
                expiresIn: '10h'
            },
            (err,token) => {
                if(err)reject(err)
                resolve(token)
            }
        
        );
    })   
}

export default createAccessToken;