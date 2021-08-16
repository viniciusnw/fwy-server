import { Document, model, Schema } from 'mongoose';
import { RequiredString } from 'core/types';

export interface CustomerAdminEntity extends Document {
  email: string;
}

export const CustomerAdminMongoModel = model<CustomerAdminEntity>('CustomerAdmin', new Schema({
  email: RequiredString,
}));