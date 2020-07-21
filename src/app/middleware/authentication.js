import jwt from 'jsonwebtoken';
import {secret} from '../../config/config.json';
import BlackList from '../models/BlackList';

export default async function (request,response,next){
    const authorization = request.headers.authorization;
    try{
        if(!authorization)
            return response.status(401).send({error : "no Token provided"})

        const parts = authorization.split(' ');

        if(!(parts.length === 2))
            return response.status(401).send({error : "Header invalid"});

        const [bearer,token ] = parts;

        if(!/^Bearer$/.test(bearer))
            return response.status(401).send({error : "token malformed"});
       
        if(token.length < 2)
            return response.status(401).send({error : "token not informed or malformed"});
        if( await BlackList.findOne({token}))
            return response.status(401).send({error : "Token invalid"});

        jwt.verify(token,secret,(err, decoded)=>{
            if(err)
              return response.status(401).send({error : "token invalid"});
              request.body.id = decoded.params.id;
             next();
        }) 
    
    }catch(err){
        console.log(err)
        return response.status(500).send({error : "authentication failed"});
    }

}
