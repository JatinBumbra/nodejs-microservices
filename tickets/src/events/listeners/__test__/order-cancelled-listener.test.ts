import { OrderCancelledEvent, OrderStatus } from "@jbticketing/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from 'mongoose'

const setup =async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString()

    const ticket = Ticket.build({
        title: 'concert',
        price: 100,
        userId: '12345678'
    })
    ticket.set({orderId});
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        status: OrderStatus.Cancelled,
        ticket: {
            id: ticket.id,
        }
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg,orderId}
}

it('updates the ticket, publishes an event and acks the message',async () => {
    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})