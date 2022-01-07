import mongoose from 'mongoose'

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('Missing env var JWT_KEY')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('Missing env var MONGO_URI')
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('Missing env var NATS_CLUSTER_ID')
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('Missing env var NATS_CLIENT_ID')
    }
    if(!process.env.NATS_URL) {
        throw new Error('Missing env var NATS_URL')
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)

        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed')
            process.exit();
        })
        process.on('SIGINT',natsWrapper.client.close)
        process.on('SIGTERM',natsWrapper.client.close)

        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error(error)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000')
    })
}
start();