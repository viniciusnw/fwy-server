import { BaseError, CustomError, NotFoundError } from 'core/errors';

export function ThrowsWhenUncaughtException<TError extends BaseError>(errorType: {
  new (message?: string): TError;
}, message?: string) {
  return (targetClass: any, method: string, methodDescriptor: any) => {
    const originalMethod = methodDescriptor.value;
    return {
      async value() {
        try {
          return await originalMethod.apply(this, arguments);
        } catch (error) {
          if (error instanceof NotFoundError) throw error;
          if (message) throw new CustomError(message, 500)
          throw new errorType(error.message);
        }
      }
    }
  }
}