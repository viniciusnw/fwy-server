import { ValidationError } from 'class-validator';
import { ApolloError } from 'apollo-server-core';
import { ErrorType } from 'core/types'

export class BaseError extends ApolloError {
  original: string;
  constructor(type: ErrorType, message?: string) {
    super(message, ErrorType[type], { name: ErrorType[type] });
    this.stack = (new Error() as any).stack;
    this.original = message;
  }
}

export class SchemaValidationError extends BaseError {
  constructor(message?: string);
  constructor(validation: ValidationError[]);
  constructor(messageOrValidation: any) {
    if (messageOrValidation instanceof Array) super(ErrorType.SchemaValidationError, JSON.stringify(messageOrValidation));
    else super(ErrorType.SchemaValidationError, messageOrValidation);
  }

  parse(): BaseError[] {
    const parsedErrors: BaseError[] = [];

    try {
      const errors = JSON.parse(this.message);
      errors.map(error => {
        Object.keys(error.constraints).map(key => {
          const parsedError = new BaseError(ErrorType.SchemaValidationError, error.constraints[key]);
          parsedErrors.push(parsedError);
        });
      });
    } catch (err) {
      parsedErrors.push({
        name: this.name,
        message: this.message,
        original: this.message,
        ...err,
      });
    }
    return parsedErrors;
  }
}

export class AuthenticationError extends BaseError {
  constructor(message?: string) {
    super(ErrorType.AuthenticationError, message);
  }
}

export class DataSourceError extends BaseError {
  constructor(message?: string) {
    super(ErrorType.DataSourceError, message);
  }
}

export class JwtValidationError extends BaseError {
  constructor(message?: string, public code?: number) {
    super(ErrorType.JwtValidationError, message ? message : 'Invalid Jwt token');
  }
}

export class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(ErrorType.NotFoundError, message);
  }
}

export class CustomError extends BaseError {
  constructor(message: string, public code?: number) {
    super(ErrorType.CustomError, message);
  }
}

export class GraphQLError extends BaseError {
  constructor(message?: string) {
    super(ErrorType.GraphQLError, message);
  }
}