// api/quiz.js
import mongoose from 'mongoose';
import axios from 'axios';

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
        const { topic } = req.body;

        try {
            const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                contents: [
                    {
                        parts: [
                            {
                                text: `Generate quiz questions for the topic: ${topic}.`
                            }
                        ]
                    }
                ]
            });

            const quizText = response.data.candidates[0].content.parts[0].text;
            const quizData = JSON.parse(quizText);
            correctAnswers = quizData.quiz.map(q => q.answer === 'true');
            // Sending the parsed quiz data back to the client
            res.json({ quiz: quizData });
            
        } catch (error) {
            console.error('Error generating quiz:', error);
            res.status(500).json({ message: 'Failed to generate quiz' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
