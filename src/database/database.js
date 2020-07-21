import mongoose from 'mongoose';
import {database} from '../config/config.json';
const {host,port,name} = database;

const url = `mongodb://${host}:${port}/${name}`;
mongoose.connect(url,{
    useCreateIndex: true,
    useNewUrlParser : true,
    useUnifiedTopology : true
  }
   
)

export default mongoose;