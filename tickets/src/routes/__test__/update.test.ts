import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

const payload = {
    title: 'Ticket',
    price: 20
}

const genId = () => new mongoose.Types.ObjectId().toHexString()

it('returns 404 for ticket that does not exist',async()=>{
    await request(app)
        .put('/api/tickets/'+genId())
        .set('Cookie',setCookie())
        .send(payload)
        .expect(404)
})

it('returns 401 for unauthenticated user',async()=>{
    await request(app)
        .put('/api/tickets/'+genId())
        .send(payload)
        .expect(401)
})

it('returns 401 for unauthorized user',async()=>{
    const createdTicket = await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send(payload)
        .expect(201)

    await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',setCookie())
        .send(payload)
        .expect(401)
})

it('returns 400 if title or price is invalid',async()=>{
    const cookie = setCookie();

    const createdTicket = await request(app)
        .post('/api/tickets/')
        .set('Cookie',cookie)
        .send(payload)
        .expect(201)

    await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',cookie)
        .send({
            title: 'Title'
        })
        .expect(400)
    await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',cookie)
        .send({
            price: -10
        })
        .expect(400)
})

it('returns 200 on successful update',async()=>{
    const cookie = setCookie();

    const createdTicket = await request(app)
        .post('/api/tickets/')
        .set('Cookie',cookie)
        .send(payload)
        .expect(201)

    const updatedTicket = await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',cookie)
        .send({...payload,title:'Updated title'})
        .expect(200)

    const res = await request(app)
        .get('/api/tickets/'+updatedTicket.body.id)
        .send()
        .expect(200)

    expect(res.body.title).toEqual(updatedTicket.body.title)
})

it('publishes an event when a new ticket is created', async() => {
    const cookie = setCookie();

    const createdTicket = await request(app)
        .post('/api/tickets/')
        .set('Cookie',cookie)
        .send(payload)
        .expect(201)

    await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',cookie)
        .send({...payload,title:'Updated title'})
        .expect(200)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects updates if ticket is reserved',async()=>{
    const cookie = setCookie();

    const createdTicket = await request(app)
        .post('/api/tickets/')
        .set('Cookie',cookie)
        .send(payload)
        .expect(201)

    const ticket = await Ticket.findById(createdTicket.body.id);
    ticket?.set({orderId:new mongoose.Types.ObjectId().toHexString()});
    await ticket?.save();

    await request(app)
        .put('/api/tickets/'+createdTicket.body.id)
        .set('Cookie',cookie)
        .send({...payload,title:'Updated title'})
        .expect(400)
})