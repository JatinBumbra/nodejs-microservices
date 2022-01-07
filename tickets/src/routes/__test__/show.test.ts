import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the ticket is not found',async () => {
    await request(app)
        .get('/api/tickets/'+new mongoose.Types.ObjectId().toHexString())
        .send()
        .expect(404)
})

it('returns the ticket if it is found',async () => {
    const payload = {
        title: 'ticket title',
        price: 10
    }
    const ticketRes = await request(app)
        .post('/api/tickets')
        .set('Cookie',setCookie())
        .send(payload)
        .expect(201)
    
    const res = await request(app)
        .get('/api/tickets/'+ticketRes.body.id)
        .send()
        .expect(200)

    expect(res.body).toEqual(ticketRes.body)
})