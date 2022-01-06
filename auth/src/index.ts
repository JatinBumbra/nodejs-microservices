import mongoose from 'mongoose'

import { app } from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('Missing env var JWT_KEY')
    }

    console.log('Connecting to MongoDB...')
    try {
        await mongoose.connect('mongodb://auth-mongo-service:27017/auth')
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error(error)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
}
start();