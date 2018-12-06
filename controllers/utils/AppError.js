'use strict';

module.exports.AppError = class AppError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        Error.captureStackTrace(this, AppError);
    }
}