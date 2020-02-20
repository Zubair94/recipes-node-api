import { Response } from 'express';

export const responseHandler = (response: Response, statusCode: number, success: boolean, message: string, data?: any) => {
    response.status(statusCode).json({
       success: success,
       message: message,
       data: data
    });
};
