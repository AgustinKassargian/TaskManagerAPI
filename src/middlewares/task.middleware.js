import { validationResult } from 'express-validator';

export const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let errorString = '';
        const errorsArray = errors.array();
        errorsArray.forEach((error, index) => {
        errorString += error.msg;
            if (index < errorsArray.length - 1) {
                errorString += ', ';
            }
            else errorString += "."
        });
        return res.status(400).json({
            message: errorString
         });
    }
    next();
};