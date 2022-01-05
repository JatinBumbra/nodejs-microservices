import { CustomError } from "./custom-error-abstract";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500
    reason = 'Error connecting to database';

    constructor() {
        super('DatabaseConnectionError');
        // Only here because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors() {
        return [
            { message: this.reason }
        ]
    }
}