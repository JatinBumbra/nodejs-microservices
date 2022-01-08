import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/orders'
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('returns error if ticket does not exist',async () => {
    await request(app)
        .post('/api/orders')
        .set('Cookie',setCookie())
        .send({
            ticketId: new mongoose.Types.ObjectId(),
        })
        .expect(404)
})

it('returns error if ticket is already reserved',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: '12345678',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',setCookie())
        .send({
            ticketId: ticket.id
        })
        .expect(400)
})

it('reserves a ticket',async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })
    await ticket.save();
    
    await request(app)
        .post('/api/orders')
        .set('Cookie',setCookie())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
})

it.todo('emits an order created event')