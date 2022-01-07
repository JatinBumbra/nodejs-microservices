import nats from 'node-nats-streaming';

console.clear();

const client = nats.connect('ticketing','abc',{
    url: 'http://localhost:4222'
})

client.on('connect',async() => {
    console.log('Publisher connected to NATS')

    const message = JSON.stringify({
        id: '123',
        title: 'concert',
        price: 20
    })

    setInterval(()=>{
        client.publish('ticket:created',message,() => {
            console.log('Event published')
        })
    },1000)
})
