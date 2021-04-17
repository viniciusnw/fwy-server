import { RequiredString } from 'core/types';
import { Document, model, Schema, models } from 'mongoose';

export interface CustomerChatEntity extends Document {
  sender: string;
  text: string;
  date: string;
}

export const CustomerChatMongoModel = (customerId: string) => {
  const DocumentName = `CustomerChat_${customerId}`;
  return models[DocumentName] ||
    model<CustomerChatEntity>(DocumentName, new Schema({
      sender: RequiredString,
      text: RequiredString,
      date: RequiredString,
    }));
}