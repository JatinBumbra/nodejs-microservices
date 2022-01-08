import request from 'supertest'
import { app } from '../../app'
import {Ticket} from '../../models/ticket'

it('fetches the order',async()=>{
    const user = setCookie();

    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const {body:createdOrder} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId: ticket.id})
        .expect(201)

    const {body:fetchedOrder} = await request(app)
        .get('/api/orders/'+createdOrder.id)
        .set('Cookie',user)
        .send()
        .expect(200)

    expect(fetchedOrder.id).toEqual(createdOrder.id)
    expect(fetchedOrder.userId).toEqual(createdOrder.userId)
})