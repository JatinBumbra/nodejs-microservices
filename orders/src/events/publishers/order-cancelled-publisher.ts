import {Publisher, Subjects, OrderCancelledEvent} from '@jbticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}