import mongoose from 'mongoose';
const { Schema } = mongoose;
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
    {
        username: { 
            type: String, 
            required: true, 
            unique: true, 
            trim: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true, 
            lowercase: true, 
            trim: true 
        },
        password: { 
            type: String, 
            required: true,
            minlength: 6
        },
        verified: { 
            type: Boolean, 
            default: false 
        },
    }, 
    { timestamps: true }
);

// Hash the password before saving the user to the database
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
     

}); 
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};  

const userModel = mongoose.model('Users', userSchema);

export default userModel;
