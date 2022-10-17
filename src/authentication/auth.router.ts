import * as express from 'express';
import { Request, Response } from "express";

export const authRouter = express.Router();

authRouter.post("/signin", async (req: Request, res: Response) => {
    try {
        res.status(201).send( { result: true } );
    }
    catch(err: any) {
        res.status(400).send({ result: false, err: err.message? err.message : "" } );
    } 
}); 

