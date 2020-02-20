import { NextFunction, Response, Request } from 'express';

export class PublicController{
    static async fetchData(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({success: true, data: "Public Data Fetched", message: "Public Data fetched"});
    }
}