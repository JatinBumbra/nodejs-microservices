import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const client = nats.connect('ticketing','abc',{
    url: 'http://localhost:4222'
})

client.on('connect',async() => {
    console.log('Publisher connected to NATS')

    const message = {
        id: '123',
        title: 'concert',
        price: 20
    }

    try {
        setInterval(async()=>{
            const pub = new TicketCreatedPublisher(client)
            await pub.publish(message)
        },3000)
    } catch (error) {
        console.error(error)
    }
})
