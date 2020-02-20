import  { ErrorResponse } from "../utils";
import { Request, Response, NextFunction } from 'express';
export const error = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    let error = { ...err };
    error.message = err.message;
    if(err.name === 'CastError') {
        const message = `${'Cast error: '}${err.message}`;
        error = new ErrorResponse(message, 404);
    }
    if(err.code === 11000) {
        const message = `${"Duplicate field value error: "}${err.message}`;
        error = new ErrorResponse(message, 400);
    }
    if(err.name === 'ValidationError') {
        error = new ErrorResponse(err.message, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};
