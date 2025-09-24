import {Request, Response} from "express"

export class UserController{
    getUserById = (req:Request, res:Response)=>{
        const userId = parseInt(req.params.id);
    }
}

