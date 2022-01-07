import { Listener,TicketCreatedEvent,Subjects } from "@jbticketing/common";
import { Message } from 'node-nats-streaming';

class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject:Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments-service';
    
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data', data);
        msg.ack();
    }
}

export { TicketCreatedListener }