export enum OrderStatus {
    // When order is created but order has not be reserved
    Created = 'created',
    // When ticket is already reserved or user cancels the order or order expires
    Cancelled = 'cancelled',
    // When ticket is reserved
    AwaitingPayment = 'awaiting:payment',
    // When payment is made
    Complete= 'complete',
}