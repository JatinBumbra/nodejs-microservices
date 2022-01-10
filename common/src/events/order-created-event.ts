import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string,
        version: number,
        status: string,
        expiresAt: string,
        userId: string,
        ticket: {
            id: string,
            price: number,
        },
    }
}
