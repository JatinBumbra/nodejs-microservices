import { TicketUpdatedListener } from './../ticket-updated-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper"
import {TicketUpdatedEvent} from '@jbticketing/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket';

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
    })
    await ticket.save();
    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        title: 'new concert',
        price: 999,
        version: ticket.version + 1,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    // create a fake message event
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg};
}

it('finds, updates and saves a ticket',async () => {
    const {listener,ticket,data,msg} = await setup()
    // call onMessage fn with data + message object
    await listener.onMessage(data,msg);
    // write assertion to make sure ticket was created
    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)
})

it('acks the message',async () => {
    const {listener,data,msg} = await setup()
    // call onMessage fn with data + message object
    await listener.onMessage(data,msg);
    // write assertion to make sure ack() is called
    expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack if version is invalid',async() => {
    const {listener,data,msg} = await setup()
    data.version = 10;
    // call onMessage fn with data + message object
    try {
        await listener.onMessage(data,msg);
    } catch (error) {}
    // write assertion to make sure ack() is not called
    expect(msg.ack).not.toHaveBeenCalled();
})