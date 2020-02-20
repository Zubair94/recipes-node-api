import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DB_URI_MONGO = process.env.DB_URI_MONGO;
