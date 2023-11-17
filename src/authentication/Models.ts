import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    date?: Date;  // This is optional because we provide a default value.
}

interface IRefreshTokenSchema extends Document {
    refreshToken: string;
    expires: Date;
    user: Types.ObjectId;
}

interface IBlacklistedRefreshToken extends Document {
    token: string;
    dateAdded: Date;
  }

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Refresh Token Schema
const RefreshTokenSchema = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expires: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 10); // Add 10 days
            return currentDate;
        }
    }
});

// Blacklisted Token Schema
const BlacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export const RefreshToken: Model<IRefreshTokenSchema> = mongoose.model<IRefreshTokenSchema>('RefreshToken', RefreshTokenSchema);
export const BlacklistedToken: Model<IBlacklistedRefreshToken> = mongoose.model<IBlacklistedRefreshToken>('BlacklistedToken', BlacklistedTokenSchema);