import { randomBytes } from 'crypto';
import nats, {Message} from 'node-nats-streaming';

console.clear();

const client = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url: 'http://localhost:4222'
})

client.on('connect',async() => {
    console.log('Listener connected to NATS')

    client.on('close',() => {
        console.log('Listener NATS connection closed')
        process.exit()
    })

    const options = client
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('service-name')
    const subs = client.subscribe('ticket:created','listenerQGroup',options);

    subs.on('message', (msg: Message) => {
        const data = msg.getData();

        if(typeof data === 'string') {
            console.log(`Received event #${msg.getSequence()}, with data:${(data)}`)
        }
        msg.ack()
    })
})

process.on('SIGINT',client.close);
process.on('SIGTERM',client.close);