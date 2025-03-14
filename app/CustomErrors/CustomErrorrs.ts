
// Custom errors

class AppError extends Error {
    statusCode: number;
    code: string;

    constructor (message: string, statusCode: number, code: string) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            status: 'error',
            message: this.message,
            code: this.code
        };
    }
}

// 400 Bad request
class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

// 500 Internal server error
class DatabaseError extends AppError {
    constructor(message: string) {
        super(message, 500, 'DATABASE_ERROR');
    }
}

class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT_ERROR');
    }
}

class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404, 'NOT_FOUND_ERROR');
    }
}


export {AppError, ValidationError, ConflictError, NotFoundError, DatabaseError, };
