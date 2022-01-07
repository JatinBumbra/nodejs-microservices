import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listining to /api/tickets for post requests',async() => {
    const res = await request(app)
        .post('/api/tickets')
        .send()

    expect(res.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in',async() => {
    const res = await request(app)
        .post('/api/tickets')
        .send({})

    expect(res.status).toEqual(401)
})

it('returns a status other than 401 if the user is signed in',async() => {
    const res = await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send({})
    expect(res.status).not.toEqual(401)
})

it('returns an error if invalid title is provided',async() => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send({
            title: '',
            price: 10
        })
        .expect(400)
})

it('returns an error if invalid price is provided',async() => {
    await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send({
            title: 'Title',
            price: -10
        })
        .expect(400)
})

it('creates a ticket with valid inputs',async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0)

    await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send({
            title: 'Title',
            price: 10
        })
        .expect(201)

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1)
})

it('publishes an event when a new ticket is created', async() => {
    await request(app)
    .post('/api/tickets')
    .set('Cookie',setCookie())
    .send({
        title: 'Title',
        price: 10
    })
    .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})