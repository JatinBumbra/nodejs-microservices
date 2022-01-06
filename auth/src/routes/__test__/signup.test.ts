import request from 'supertest'
import { app } from '../../app'

it('returns as 201 on successful signup',async() => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(201)
})

it('returns a 400 with an invalid email',async() => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@',
            password: 'password'
        }).expect(400)
})

it('returns a 400 with an invalid password',async() => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@',
            password: 'pas'
        }).expect(400)
})

it('returns a 400 with an no email or password',async() => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('prevents duplicate emails',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    }).expect(201)

    return request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    }).expect(400)
})

it('sets a cookie header after successful signup', async() => {
    const res = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    }).expect(201)

    expect(res.get('Set-Cookie')).toBeDefined();
})