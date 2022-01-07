import request from 'supertest'
import { app } from '../../app'

const createTicket = () => 
    request(app)
    .post('/api/tickets')
    .set('Cookie',setCookie())
    .send({
        title:'Title',
        price: 20
    }).expect(201)

it('returns all the tickets available',async () => {
    await createTicket()
    await createTicket()
    await createTicket()

    const res = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200)

    expect(res.body.length).toEqual(3)
})