import request from 'supertest'
import { app } from '../../app'

it('fails for a non-existing email',async() => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'doesnotexist@test.com',
            password: 'password'
        }).expect(400)
})

it('fails for an incorrect password',async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        }).expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'pass'
        }).expect(400)
})

it('successfully signs in a user',async() => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'password'
        }).expect(201)

    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'password'
        }).expect(200)

    expect(res.get('Set-Cookie')).toBeDefined()
})