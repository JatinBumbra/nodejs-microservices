import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        id: string,
        status: string,
        version: number,
        ticket: {
            id: string,
        },
    }
}
