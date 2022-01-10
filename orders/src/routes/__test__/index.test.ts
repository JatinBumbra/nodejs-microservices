import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = async() => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()
    return ticket
}

it('fetches orders for a user',async () => {
    // Create two users
    const user1 = setCookie();
    const user2 = setCookie();
    // Create 3 tickets
    const ticketOne =  await buildTicket()
    const ticketTwo =  await buildTicket()
    const ticketThree =  await buildTicket()
    // Order first ticket against user1
    await request(app)
        .post('/api/orders')
        .set('Cookie',user1)
        .send({ ticketId: ticketOne.id })
        .expect(201)
    // Order remaining tickets against user1
    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie',user2)
        .send({ ticketId: ticketTwo.id })
        .expect(201)
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie',user2)
        .send({ ticketId: ticketThree.id })
        .expect(201)

    const res = await request(app)
        .get('/api/orders')
        .set('Cookie',user2)
        .send()
        .expect(200)

    expect(res.body.length).toEqual(2)
    expect(res.body[0].id).toEqual(orderOne.id)
    expect(res.body[1].id).toEqual(orderTwo.id)
    expect(res.body[0].ticket.id).toEqual(ticketTwo.id)
    expect(res.body[1].ticket.id).toEqual(ticketThree.id)
})