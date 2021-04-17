import { BaseError, CustomError, SchemaValidationError } from 'core/errors';
import { ErrorType } from 'core/types'
import { GraphQLError } from 'graphql';
import { get } from 'lodash';

// import * as newrelic from 'newrelic';
// newrelic.addCustomAttributes({ 'resolver': resolver, 'message': get(error, 'message') });
// newrelic.noticeError(error);

export const formatError = (error: GraphQLError) => {
  let errorType: ErrorType;
  if (error.originalError) errorType = (ErrorType as any)[error.originalError.name];
  else errorType = ErrorType.GraphQLError;

  let appError;
  if (errorType === ErrorType.SchemaValidationError)appError = new SchemaValidationError(error.message);
  else if (errorType === ErrorType.CustomError) appError = new CustomError(error.message) 
  else appError = new BaseError(errorType, error.message);

  const trace = get(error, 'extensions.exception.stacktrace[3]', '');
  const resolver = trace.substring(trace.indexOf(':') + 2, trace.indexOf('('));  

  return error;
};
