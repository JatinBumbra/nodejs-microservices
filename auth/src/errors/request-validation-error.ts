import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error-abstract";

export class RequestValidationError extends CustomError {
    statusCode = 400

    constructor(public errors: ValidationError[]) {
        super('RequestValidationError');
        // Only here because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map(error => ({
            message: error.msg, field: error.param
        }))
    }
}