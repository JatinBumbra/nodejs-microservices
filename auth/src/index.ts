import express from 'express';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';
import { signOutRouter } from './routes/signout';
import { currentUserRouter } from './routes/current-user';

const app = express()
app.use(express.json());

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signUpRouter)

app.listen(3000, () => {
    console.log('Listening on port 3000')
})