/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Schema, Document } from 'mongoose';
import mongoose from '../../loader/mongo-loader';
import * as DTO from '../../types';


interface Qodex {
    _id: any;
    name: string;
    description: string;
    questions_id: string[];
}

interface QodexDocument extends Document, Qodex {
    containsQuestion(question_id: string): Promise<boolean>;
}

interface QodexModel extends Model<QodexDocument> {
  findAndLean(filter: {}): Promise<DTO.Qodex[]>;
  findByIdAndLean(qodex_id: string): Promise<DTO.Qodex>;
}


const QodexSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  questions_id: { type: [Schema.Types.ObjectId] },
});

QodexSchema.methods.containsQuestion = async function _(question_id: string): Promise<boolean> {
  const match = await this.questions_id.includes(question_id);
  return match;
};


async function toDto(qodex: Qodex): Promise<DTO.Qodex> {
  const dto = {
    id: qodex._id,
    name: qodex.name,
    description: qodex.description,
    questions_count: qodex.questions_id.length,
  } as DTO.Qodex;
  return dto;
}


QodexSchema.statics.findAndLean = async function _(filter: {}): Promise<DTO.Qodex[]> {
  const lean = await this.find(filter).lean();
  const qodexes = [] as Promise<DTO.Qodex>[];
  lean.forEach((qodex: Qodex) => {
    qodexes.push(toDto(qodex));
  });
  return Promise.all(qodexes);
};

QodexSchema.statics.findByIdAndLean = async function _(qodex_id: string): Promise<DTO.Qodex> {
  const lean = await this.findById(qodex_id).lean();
  return toDto(lean);
};


export default mongoose.model<QodexDocument, QodexModel>('Qodex', QodexSchema);
