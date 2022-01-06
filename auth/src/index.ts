import mongoose from 'mongoose'

import { app } from './app';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('Missing env var JWT_KEY')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('Missing env var MONGO_URI')
    }

    console.log('Connecting to MongoDB...')
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error(error)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
}
start();