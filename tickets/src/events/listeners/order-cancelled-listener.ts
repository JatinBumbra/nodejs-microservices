import { queueGroupName } from './queue-group-name';
import { Listener, OrderCancelledEvent, Subjects } from "@jbticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) throw new Error('Ticket not found');
        // mark ticket as reserved by setting its orderId property
        ticket.set({orderId:undefined});
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            version: ticket.version,
            orderId: ticket.orderId
        })

        msg.ack();
    }
}