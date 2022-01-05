import express from 'express';
require('express-async-errors');

import mongoose from 'mongoose'

import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express()
app.use(express.json());

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*',async() => {
    throw new NotFoundError()
})

app.use(errorHandler)

const start = async() => {
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