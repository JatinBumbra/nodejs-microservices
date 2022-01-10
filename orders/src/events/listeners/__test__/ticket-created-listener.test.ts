import { Message } from 'node-nats-streaming';
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import {TicketCreatedEvent} from '@jbticketing/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        version: 0,
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    // create a fake message event
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,data,msg};
}

it('creates and saves a ticket',async () => {
    const {listener,data,msg} = await setup()
    // call onMessage fn with data + message object
    await listener.onMessage(data,msg);
    // write assertion to make sure ticket was created
    const ticket = Ticket.findForEvent(data);
    expect(ticket).toBeDefined();
})

it('acks the message',async () => {
    const {listener,data,msg} = await setup()
    // call onMessage fn with data + message object
    await listener.onMessage(data,msg);
    // write assertion to make sure ack() is called
    expect(msg.ack).toHaveBeenCalled();
})