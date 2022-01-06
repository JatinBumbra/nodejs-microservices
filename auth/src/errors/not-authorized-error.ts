import { CustomError } from "./custom-error-abstract";

export class NotAuthorizedError extends CustomError {
    statusCode = 401

    constructor() {
        super('NotAuthorizedError')
        Object.setPrototypeOf(this,NotAuthorizedError.prototype)
    }

    serializeErrors() {
        return [{message:'Not authorized'}]
    }
}