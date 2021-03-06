import request from 'supertest'
import { app } from '../../app'
import { natsWrapper } from '../../nats-wrapper';
import {OrderStatus} from '../../models/orders'
import {Ticket} from '../../models/ticket'
import mongoose from 'mongoose'

it('marks an order as cancelled and emits an order:cancelled event',async()=>{
    const user = setCookie();

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const {body:createdOrder} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)

    await request(app)
        .delete('/api/orders/'+createdOrder.id)
        .set('Cookie',user)
        .send()
        .expect(204)

    const {body:fetchedOrder} = await request(app)
        .get('/api/orders/'+createdOrder.id)
        .set('Cookie',user)
        .send()
        .expect(200)

    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})