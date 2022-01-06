import request from 'supertest'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { app } from '../app'

declare global {
    function signup(): Promise<string[]>
}

let mongo: any;

beforeAll(async()=>{
    process.env.JWT_KEY = 'securekey';
    
    mongo = await MongoMemoryServer.create();
    const mongoURI = mongo.getUri();
    await mongoose.connect(mongoURI);
})

beforeEach(async()=>{
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async()=>{
    await mongo.stop();
    await mongoose.connection.close()
})

global.signup = async() => {
    const email = 'test@test.com';
    const password = 'password';

    const res = await request(app)
    .post('/api/users/signup')
    .send({
        email,
        password
    }).expect(201)

    const cookie = res.get('Set-Cookie');

    return cookie;
}