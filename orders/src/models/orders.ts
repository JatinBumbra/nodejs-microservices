import mongoose from 'mongoose'
import {OrderStatus} from '@jbticketing/common'
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// Describes the properties required to create a new Order
interface OrderAttrs {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc,
}

// Describes properties on Order Model
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs:OrderAttrs): OrderDoc
}

// Describes the properties that a user document has
interface OrderDoc extends mongoose.Document {
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDoc,
    version: number
}

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
},{
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

OrderSchema.set('versionKey',"version")
OrderSchema.plugin(updateIfCurrentPlugin)

OrderSchema.statics.build = (attrs:OrderAttrs) => new Order(attrs)

const Order = mongoose.model<OrderDoc,OrderModel>('Order',OrderSchema)

export {Order,OrderStatus}