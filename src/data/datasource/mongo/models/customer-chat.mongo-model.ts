import { RequiredString, RequiredDate } from 'core/types';
import { Document, model, Schema, models } from 'mongoose';

export interface CustomerMessageEntity extends Document {
  sender: string;
  text: string;
  date: Date;
}

export const CustomerChatMongoModel = (customerId: string) => {
  const DocumentName = `CustomerChat_${customerId}`;
  return models[DocumentName] ||
    model<CustomerMessageEntity>(DocumentName, new Schema({
      sender: RequiredString,
      text: RequiredString,
      date: RequiredDate,
    }));
}