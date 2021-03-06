import express from 'express';
require('express-async-errors');

import cookieSession from 'cookie-session';

import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

import { errorHandler, NotFoundError } from '@jbticketing/common';

const app = express()
app.set('trust proxy',true)
app.use(express.json());

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.all('*',async() => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}