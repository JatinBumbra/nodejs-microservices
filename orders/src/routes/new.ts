import express, { Request, Response } from 'express'
import { requireAuth, validateRequest, NotFoundError, BadRequestError } from '@jbticketing/common'
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/orders';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import mongoose from 'mongoose'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders', 
    requireAuth, 
    [
        body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided'),
    ],
    validateRequest,
    async(req:Request,res:Response) => {
        const {ticketId} = req.body;

        const ticket = await Ticket.findById(ticketId)
        if(!ticket) throw new NotFoundError()

        const isReserved = await ticket.isReserved()
        if(isReserved) throw new BadRequestError('Ticket is already reserved')

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        })
        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            expiresAt: order.expiresAt.toISOString(),
            userId: req.currentUser!.id,
            ticket: {
                id: ticket.id,
                price: ticket.price,
            }
        })

        res.status(201).send(order);
})

export {router as createOrderRouter}