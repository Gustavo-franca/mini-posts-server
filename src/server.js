import express from 'express';

import {host, port} from './config/config.json';
import router from './routes';

const server = express();

server.use(express.json());
server.use(router);


server.listen(port,()=>{
    console.log(`server listening in http://${host}:${port}`);
})
