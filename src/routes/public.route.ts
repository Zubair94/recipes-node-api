import { Router } from "express";
import { PublicController } from "../controllers";
import { requestHandler } from "../utils";

export const publicRoutes = Router();
publicRoutes.get('/', requestHandler(PublicController.fetchData));
