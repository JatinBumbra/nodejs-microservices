import { ExpirationCompleteListener } from './../expiration-complete-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from "../../../nats-wrapper"
import {ExpirationCompleteEvent, OrderStatus} from '@jbticketing/common'
import mongoose from 'mongoose'
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/orders';

const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
    })
    await ticket.save();

    const order = Order.build({
        ticket,
        status: OrderStatus.Created,
        expiresAt: new Date(),
        userId: '123456789'
    })
    await order.save();
    // create a fake data event
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    // create a fake message event
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg,order};
}

it('updates order status to cancelled',async () => {
    const {listener,order,data,msg} = await setup()
    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it('emit an OrderCancelled event',async() => {
    const {listener,data,msg,order} = await setup();
    await listener.onMessage(data,msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
})

it('acks the message',async () => {
    const {listener,data,msg} = await setup()
    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})