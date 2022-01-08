import {Publisher, Subjects, TicketCreatedEvent} from '@jbticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}