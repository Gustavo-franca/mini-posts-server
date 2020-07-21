import express from 'express';
import authRouter from './authentication';
import userRouter from './user';

const router = express.Router();



router.use('/authentication',authRouter);
router.use('/user',userRouter);

//identificar os arquivos que estão dentro da pasta routes
//const aaa = require('./auth');


//  function import(app){
//     fs.readdirSync(__dirname)
//     .filter((file) => file != '.' && file != 'index.js')
//     .forEach(file =>{
//        import `${path.resolve(__dirname,file))}`(app);

//     });
//  }


export default router

