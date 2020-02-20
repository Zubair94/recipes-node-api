import { Request, Response, NextFunction } from "express";

export class PrivateController {
    static async fetchData(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({success: true, data: "Private Data", message: "Private Data fetched"});
    }
}