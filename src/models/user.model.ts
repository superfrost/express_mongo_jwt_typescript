import mongoose, { Schema, model } from 'mongoose';

export interface User extends mongoose.Document {
    login: string;
    email: string;
    password: string;
    registerDate?: string;
    comparePassword(candidatePass: string): Promise<Boolean>;
}

// - users (login, email, password (bcrypt), registerDate (data))
const userSchema = new Schema<User>({
    login: { type: String, unique: true, required: true, },
    email: { type: String, unique: true, required: true, },
    password: { type: String, required: true, },
    registerDate: { type: Date, default: Date.now, }
})

export default model('users', userSchema)