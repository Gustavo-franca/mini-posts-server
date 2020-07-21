import mongoose from '../../database/database';
import bcrypt from 'bcryptjs';
const UserSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            unique: true,
            required: true,
        },
        password : {
            type : String ,
            required : true,
            select: false,
        },
        passwordResetToken :{
            type: String,
            select : false
        },
        passwordTokenExpires : {
            type : Date,
            select : false
        },
        creatAt :{
            type : Date,
            default : Date.now,
        }
    },
);

UserSchema.pre('save',async function (next){

  const hash = await bcrypt.hash(this.password,10);
  this.password = hash;
  next();
});

export default mongoose.model('User',UserSchema);