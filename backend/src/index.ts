import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ContactController } from "./controllers/contactController";
import prisma from "./dataBase/prismaDb";

dotenv.config();

class App {
    private app: Express;
    constructor() {
        this.app  = express();
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors());
    }
    public init = async () => {
        try {
            this.app.listen(process.env.ENV_PORT, () => {
                console.log(`Server running on port ${process.env.ENV_PORT}`);
            })
            this.app.use("/contact", new ContactController(prisma).getRouter());
            process.on("beforeExit", () => {
                prisma.$disconnect();
            })
        } catch (error: unknown) {
            const err = error as Error;
            console.log(err.message);
        }

    }}

const server = new App();

server.init().then(() => {
    console.log("Server is ok");
}).catch(() => {
    console.log("Server is not ok");
});
