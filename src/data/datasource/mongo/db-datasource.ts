import { DataSourceError } from 'core/errors';
import { ThrowsWhenUncaughtException } from 'core/middlewares'
import { Document, Model, Types } from 'mongoose';

export abstract class DBDataSource<Entity extends Document> {

  constructor(protected model: Model<Entity>) { }

  @ThrowsWhenUncaughtException(DataSourceError)
  create(entity: Entity): Promise<Entity> {
    return this.model.create(entity);
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  update(id: string, entity: Entity): Promise<any> {
    return this.model.update({ _id: this.toObjectId(id) }, entity).exec();
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  delete(id: string): Promise<any> {
    return this.model.remove({ _id: this.toObjectId(id) }).exec();
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  get(id: string): Promise<Entity> {
    return this.model.findById(id).lean().exec() as Promise<Entity>;
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  list(): Promise<Entity[]> {
    return this.model.find().lean().exec() as Promise<Entity[]>;
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  ensureIndexes(): Promise<void> {
    return this.model.ensureIndexes();
  }

  @ThrowsWhenUncaughtException(DataSourceError)
  async listPaginated(offset: number, limit: number, conditions?: Object, projection?: Object): Promise<[Entity[], number]> {
    const count = await this.model.count(conditions).exec();
    const items = await this.model.find(conditions, projection).skip(offset).limit(limit).lean().exec() as Entity[];
    return [items, count];
  }

  protected toObjectId(id: string): Types.ObjectId {
    return Types.ObjectId.createFromHexString(id);
  }
}
