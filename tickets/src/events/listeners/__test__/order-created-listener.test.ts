import { OrderCreatedEvent, OrderStatus } from "@jbticketing/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from 'mongoose'

const setup =async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: 'concert',
        price: 100,
        userId: '12345678'
    })
    await ticket.save();

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        expiresAt: '',
        userId: '56789',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg}
}

it('sets the orderId of the ticket',async () => {
    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toEqual(data.id);
})

it('acks the message',async () => {
    const {listener,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})

it('publises a ticket updated event',async () => {
    const {listener,data,msg} = await setup();

    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(updatedTicket.orderId).toEqual(data.id);
})