import mongoose from "mongoose";

const taskSchema =  new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
},{
    timestamps:true
});

export default mongoose.model('Task', taskSchema);
