import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import express, { Router } from "express";
import { nameRegex, phoneNumberRegex } from "../regex/regex";

export class ContactController {
    private router: Router;
    private db: PrismaClient;
    
    constructor(db: PrismaClient) {
        this.db = db;
        this.router = express.Router();
        this.router.get("/", this.getAllContacts);
        this.router.post("/", this.addContact);
        this.router.delete("/:id", this.deleteContact);
    }

    public getRouter = () => {
        return this.router;
    }

    private getAllContacts = async (req: express.Request, res: express.Response) => {
        try {
            const contacts = await this.db.contact.findMany();
            res.send(contacts);
        } catch (error: unknown) {
            const err = error as Error;
            const myError = {
                message: err.message
            }
            res.status(400).send(myError);
        }
    }

    private addContact = async (req: express.Request, res: express.Response) => {
        try {
            if (req.body.contactName.trim() === '' || nameRegex.test(req.body.contactName)) {
                throw new Error('Name cannot be empty.');
            }
            if (!phoneNumberRegex.test(req.body.contactNumber)) {
                throw new Error('Phone Number must special format.');
            }
            const newContact = await this.db.contact.create({
                data: req.body
            })
            res.send(newContact);
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    res.status(400).send({
                        message: `${error.meta?.target} must be unique.`}
                    );
            } else {
                const err = error as Error;
                const myError = {
                    message: err.message
                }
                res.status(400).send(myError);
            }
        }
    }

    private deleteContact = async (req: express.Request, res: express.Response) => {
        try {
            const deletedContact = await this.db.contact.delete({
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(deletedContact);
        } catch (error: unknown) {
            const err = error as Error;
            const myError = {
                message: err.message
            }
            res.status(400).send(myError);
        }
    }

}