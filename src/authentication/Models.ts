import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
    email: string;
    password: string;
    date?: Date;  // This is optional because we provide a default value.
}

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
