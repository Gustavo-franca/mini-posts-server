import mongoose from '../../database/database';

const BlackListsSchema = new mongoose.Schema(
    {
        token : {
            type : String,
            required : true,
            unique : true
        }
    }
)

export default mongoose.model('BlackList',BlackListsSchema);