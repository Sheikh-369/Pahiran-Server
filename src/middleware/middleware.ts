import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import User from "../database/models/user-model";

interface IExtendedRequest extends Request{
    user?:{
        id:string,
        userName:string,
        userEmail:string,
        role:string,
        userPassword:string
    }
}

export enum Role{
    Admin = 'admin', 
    Customer = "customer"
}

class Middleware{
    static  async isLoggedIn(req:IExtendedRequest,res:Response,next:NextFunction){
        const token=req.headers.authorization
        if(!token){
            res.status(400).json({
                message:"Please Provide Token!"
            })
            return
        }

        jwt.verify(token,process.env.JWT_SECRET!,async(err,success:any)=>{
            if(err){
                res.status(400).json({
                    message:"Invalid Token!"
                })
                return
            }
            const userData=await User.findByPk(success.id)
            if(!userData){
                res.status(400).json({
                    message:"The user does not exist!"
                })
                return
            }
            req.user=userData
            next()
        })

        
    }

    static accessTo(...roles:Role[]){ 
        return (req:IExtendedRequest,res:Response,next:NextFunction)=>{
            const userRole = req.user?.role as Role
           if(!roles.includes(userRole)){
                res.status(403).json({
                    message : "Unauthorized Access!"
                })
                return
            }
            next()
        }
    }
}

export default Middleware