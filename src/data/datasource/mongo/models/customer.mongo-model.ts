import { Document, model, Schema } from 'mongoose';
import { RequiredString, OptionalNumber, OptionalString, OptionalBuffer, RequiredDate } from 'core/types';


export interface AvatarEntity {
  type: string,
  data: Buffer 
}
export interface CustomerEntity extends Document {
  name: string;
  email: string;
  phone: string;
  birthday: Date;
  gender?: string;
  country: string;
  state: string;
  weight?: number;
  height?: number;
  password: string;
  avatar?: AvatarEntity;
}

export const CustomerMongoModel = model<CustomerEntity>('Customer', new Schema({
  name: RequiredString,
  email: RequiredString,
  phone: RequiredString,
  birthday: RequiredDate,
  gender: OptionalString,
  country: RequiredString,
  state: RequiredString,
  weight: OptionalNumber,
  height: OptionalNumber,
  password: RequiredString,
  avatar: {
    type: OptionalString,
    data: OptionalBuffer
  }
}));