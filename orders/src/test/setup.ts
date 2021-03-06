import jwt from 'jsonwebtoken'
import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'

jest.mock('../nats-wrapper.ts')

declare global {
    function setCookie(): string[]
}

let mongo: any;

beforeAll(async()=>{
    process.env.JWT_KEY = 'securekey';
    
    mongo = await MongoMemoryServer.create();
    const mongoURI = mongo.getUri();
    await mongoose.connect(mongoURI);
})

beforeEach(async()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async()=>{
    await mongo.stop();
    await mongoose.connection.close()
})

global.setCookie = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }
    const token = jwt.sign(payload,process.env.JWT_KEY!);
    const sessionJSON = JSON.stringify({jwt: token})

    return [`session=${Buffer.from(sessionJSON).toString('base64')}`];
}