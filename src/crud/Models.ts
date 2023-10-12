import mongoose, { Schema, Document, Model } from 'mongoose';

interface INotes extends Document {
    title: string;
    description: string;
    date?: Date;  // This is optional because we provide a default value.
    user: mongoose.Types.ObjectId;
}

const NotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})


const NotesModel: Model<INotes> = mongoose.model<INotes>('Notes', NotesSchema);

export default NotesModel;
