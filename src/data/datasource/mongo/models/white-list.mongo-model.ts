import { Document, model, Schema } from 'mongoose';
import { RequiredString, OptionalNumber, OptionalString, OptionalBuffer, RequiredDate } from 'core/types';

export interface WhiteListItemEntity extends Document {
  email: string;
}

export const WhiteListMongoModel = model<WhiteListItemEntity>('WhiteList', new Schema({
  email: RequiredString,
}));