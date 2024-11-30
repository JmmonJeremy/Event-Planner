import mongoose, { Document, Schema } from 'mongoose';

interface IClass extends Document {
  name: string;
  teacher: string;
  userId: string;
  startTime: Date;
  length: Number;
  days: Array<Number>;
}

const classSchema: Schema = new Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true},
  userId: { type: String, required: true },
  startTime: { type: Date, required: true},
  length: { type: Number, required: true},
  days: {type: Array<Number>, required: true}
});

const ClassModel = mongoose.model<IClass>('Class', classSchema);

export default ClassModel;