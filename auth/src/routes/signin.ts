import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken';
import { Password } from './../utils/password';
import { BadRequestError, validateRequest } from '@jbticketing/common';
import { User } from '../models/user';

const router = express.Router()

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').trim().notEmpty().withMessage('Password not provided')
    ],
    validateRequest,
    async(req:Request,res:Response) => {
        const {email,password} = req.body;

        const user = await User.findOne({email});
        if(!user) {
            throw new BadRequestError('Invalid credentials')
        }

        const passwordMatch = await Password.compare(user.password,password)
        if(!passwordMatch) {
            throw new BadRequestError('Invalid credentials')
        }

        const userJwt = jwt.sign({id:user._id, email: user.email},process.env.JWT_KEY!)
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(user)
})

export {router as signInRouter}