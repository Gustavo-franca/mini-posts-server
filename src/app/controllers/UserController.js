import User from '../models/User'
import BlackList from '../models/BlackList';
import jwt from 'jsonwebtoken';
import {secret} from '../../config/config.json';

import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import sendEmail from '../../modules/mail';
import path from 'path';

function generateToken (params){
    return jwt.sign({params},secret);
}
export default class UserController {

    async create(request,response){
        const {email} = request.body;
        try{
            if(await User.findOne({email}))
                return response.status(400).send({error : "User already registered"});
            const user = await User.create(request.body);
            
            user.password = undefined;

            return response.send({
                user,
                token : generateToken(user.id)
            })

        }catch(err){
            console.log(err)
            return response.status(400).send({error : "registration failed"});
        }
        
    }

    async login(request,response) {
        const {email,password} = request.body;
        try{
            const user = await User.findOne({email}).select("+password");
            if(!user)
                return response.status(400).send({error : "User not found"});
                
            if(!await bcryptjs.compare(password,user.password))
                return response.status(400).send({error: "Invalid password"});
            
            user.password = undefined;    
            
            return response.send({
                user,
                token : generateToken({id : user.id })
            });
        }catch(err){
            return response.status(400).send({error : "login failed, please try later"});
        }  
    }   
    async logout(request,response){
       try{

        const [bearer , token] = request.headers.authorization.split(' ');


        if(!(await BlackList.create({token})))
            return response.status(500).send({error : "token insert blackList failed"});
        
        
        return response.send();


       }catch(err){
           console.log(err)
           return response.status(500).send({error : "logout failed"});
       }
      


    }

    async forgot(request,response){
        const {email} = request.body;
        try{
        const user = await User.findOne({email});
        if(!user)
            return response.status(401).send({error : "User not found"});

         const token =  crypto.randomBytes(20).toString('hex');
 
         const now = new Date();
         console.log(now);
         now.setHours( now.getHours() + 1 )
        
        await user.updateOne({
            passwordResetToken : token,
            passwordTokenExpires : now
        })

        //enviar por email
       sendEmail({
            to : email,
            subject : "Esqueceu a sua Senha?",
            templateDir : path.resolve(__dirname,'..','..','models','email','forgot_password.html'),
            context : {token}
        }).then((result)=>{
        return response.send({result});
        }).catch((err)=>{
            console.log(err.response.body);
            return response.status(500).send({error : "send Email failed, please try again"});
        })

 


        }catch(err){
            console.log(err)
            return response.status(500).send({error : "Create token fail , try later"});
        }
        
    }

    async resetPassword(request,response){
        const {email,newPassword, token} = request.body;
    try{
        if(!token)
            return response.status(400).send({error : "No token provided"});

        const user = await User.findOne({email}).select('+password passwordResetToken passwordTokenExpires');
    
        if(!user)
            return response.status(401).send({error : "User not found"});

        if(token != user.passwordResetToken)
             return response.status(401).send({error : "token invalid"});
        const now = new Date();

        if(now > user.passwordTokenExpires)
             return response.status(401).send({error : "token expired, request a new token"});

        user.password = newPassword;

       await user.save();

        return response.send();
    }catch(err){
        console.log(err)
        return response.status(500).send({error : "reset password failed, try later"});

    }
        
        


    }
}