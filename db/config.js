import mongoose from 'mongoose';

const dbConnection = async() => {
    
    try {
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Database online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la database');
    }

}

export { dbConnection };