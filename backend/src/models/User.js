import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },        
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving the user model
UserSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (pw) {
    return bcrypt.compare(pw, this.password);
};

const User = mongoose.model('User', UserSchema);
export default User;
