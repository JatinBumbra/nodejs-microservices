import { OrderStatus } from './types/order-status';
import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string,
        version: string,
        expiresAt: string,
        userId: string,
        ticket: {
            id: string,
            price: number,
        },
    }
}