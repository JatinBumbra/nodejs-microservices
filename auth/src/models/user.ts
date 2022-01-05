import mongoose from 'mongoose'
import { Password } from './../utils/password';

// Describes the properties required to create a new User
interface UserAttrs {
    email: string,
    password: string
}
// Describes properties on User model
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs:UserAttrs): UserDoc;
}
// Describes the properties that a User document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})
UserSchema.statics.build = (attrs:UserAttrs) => {
    return new User(attrs);
}

UserSchema.pre('save',async function name(done) {
    if(this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done()
})

const User = mongoose.model<UserDoc,UserModel>('User',UserSchema)

export {User};