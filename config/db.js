import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const Connection = async () => {
    const URL = `mongodb+srv://${USERNAME}:${PASSWORD}@ecommerse.wi1zddp.mongodb.net/tweeter?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
        });
        console.log('Database Connected Successfully');
    } catch (error) {
        console.log('Error: ', error.message);
    }
};

export default Connection;
