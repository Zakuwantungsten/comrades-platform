import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcryptjs';


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }  , 
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    } ,        

    createdAt: {
        type: Date,
        default: Date.now
    }
}
);
// Hash the password before saving the user model
UserSchema.pre('save', async function(next) {
    const user = this;
    if (this.isModified('password') || this.isNew) {
        try {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        return next();
    }
} );
// Method to compare password for login
UserSchema.methods.comparePassword = function(pw) {
    return bcrypt.compare(pw, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;