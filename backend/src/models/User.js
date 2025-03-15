import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
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
    isAdmin: {
        type: Boolean,
        default: false
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
            console.log("🔹 Before Hashing Password:", this.password); // Debug before hashing
            this.password = await bcrypt.hash(this.password, 10);
            console.log("✅ Hashed Password:", this.password); // Debug after hashing
            next();
        } catch (error) {
            console.error("❌ Error hashing password:", error);
            next(error);
        }
    } else {
        next();
    }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword) {
    console.log("🔹 Comparing Entered Password:", enteredPassword, "With Hashed Password:", this.password);
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        console.log("✅ Password Match Result:", isMatch);
        return isMatch;
    } catch (error) {
        console.error("❌ Error comparing password:", error);
        return false;
    }
};

const User = mongoose.model('User', UserSchema);
export default User;
