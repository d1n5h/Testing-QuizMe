// api/login.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const connectDb = async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
};

export default async function handler(req, res) {
    await connectDb();

    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username, password });
            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
            res.json({ token });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
