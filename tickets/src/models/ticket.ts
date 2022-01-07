import mongoose from 'mongoose'

// Describes the properties required to create a new Ticket
interface TicketAttrs {
    title: string,
    price: number,
    userId: string
}

// Describes properties on Ticket Model
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs:TicketAttrs): TicketDoc
}

// Describes the properties that a user document has
interface TicketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string
}

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true
    }
},{
    toJSON: {
        transform(doc,ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

TicketSchema.statics.build = (attrs:TicketAttrs) => new Ticket(attrs)

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',TicketSchema)

export {Ticket}