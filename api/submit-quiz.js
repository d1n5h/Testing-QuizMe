// api/submit-quiz.js
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/User';

let correctAnswers = []; // You will need to set this based on the quiz generation logic

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
        const { answers, topic } = req.body;

        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) return res.sendStatus(403);

            let score = 0;

            // Example logic for calculating score based on user answers
            
    userAnswers.forEach((userAnswer) => {
        const questionIndex = parseInt(userAnswer.questionIndex, 10);
        const userAnswerValue = userAnswer.answer === 'true';

        if (correctAnswers[questionIndex] === userAnswerValue) {
            score++;
        }
    });

            try {
                // Update the user's score in the database
                await User.findOneAndUpdate(
                    { username: user.username },
                    { $push: { scores: { topic, score, totalQuestions: correctAnswers.length } } },
                    { new: true }
                );

                // Return the score and total number of questions to the client
                res.json({ score: score, totalQuestions: correctAnswers.length });
            } catch (error) {
                console.error('Error updating score:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
