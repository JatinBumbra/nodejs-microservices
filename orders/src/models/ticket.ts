import mongoose from 'mongoose'
import { Order,OrderStatus } from './orders'
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

// Describes the properties required to create a new Ticket
interface TicketAttrs {
    id: string,
    title: string,
    price: number,
}

interface TicketEvent {
    id:string,
    version:number
}

// Describes properties on Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs:TicketAttrs): TicketDoc;
    findForEvent(event: TicketEvent): Promise<TicketDoc | null>;
}

// Describes the properties that a user document has
interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    version: number,
    isReserved(): Promise<boolean>
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
},{
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

TicketSchema.set('versionKey','version')
TicketSchema.plugin(updateIfCurrentPlugin)

TicketSchema.statics.build = (attrs:TicketAttrs) => new Ticket({...attrs,_id:attrs.id})
TicketSchema.statics.findForEvent = (event:TicketEvent) => Ticket.findOne({_id:event.id,version:event.version-1})

TicketSchema.methods.isReserved = async function() {
    // Run a query to look at all orders. Find an order where the ticker
    // is the ticket we found *and* the order status is *not* cancelled.
    // If we find an order then the ticket *is* reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment
            ]
        }
    })
    return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',TicketSchema)

export {Ticket, TicketDoc}