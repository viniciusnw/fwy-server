import { Document, model, Schema } from 'mongoose';
import { RequiredString } from 'core/types';

export interface CustomerSubscriptionEntity extends Document {
  customerId: string;
  subscriptionId: string;
  status: string;
}

export const CustomerSubscriptionMongoModel = model<CustomerSubscriptionEntity>('CustomerSubscription', new Schema({
  customerId: Schema.Types.ObjectId,
  subscriptionId: RequiredString,
  status: RequiredString
}));