import {Publisher, Subjects, OrderCreatedEvent} from '@jbticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}