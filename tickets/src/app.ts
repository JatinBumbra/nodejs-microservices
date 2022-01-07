import express from 'express';
require('express-async-errors');

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jbticketing/common';

import { getTicketsRouter } from './routes';
import { getTicketRouter } from './routes/show';
import { createTicketRouter } from './routes/new';

const app = express()
app.set('trust proxy',true)
app.use(express.json());

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))
app.use(currentUser)

app.use(getTicketRouter)
app.use(getTicketsRouter)
app.use(createTicketRouter)

app.all('*',async() => {
    throw new NotFoundError()
})

app.use(errorHandler)

export {app}