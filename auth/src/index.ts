import express from 'express';
require('express-async-errors');
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

app.listen(3000, () => {
    console.log('Listening on port 3000')
})