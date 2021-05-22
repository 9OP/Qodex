/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Schema, Document } from 'mongoose';
import mongoose from '../../loader/mongo-loader';
import User from './user-model';
import sanitize from './sanitize';
import * as DTO from '../../types';

interface Answer {
  _id: any;
  question_id: string;
  author_id: string;
  answer: string;
  date: string;
  score: { upvotes: string[]; downvotes: string[] };
}


interface AnswerDocument extends Document, Answer {
    isAuthor(author_id: string): Promise<boolean>;
    upVote(user_id: string): Promise<void>;
    downVote(user_id: string): Promise<void>;
    editData(new_data: DTO.Answer): Promise<void>;
}

interface AnswerModel extends Model<AnswerDocument> {
    findAndLean(filter: {}): Promise<DTO.Answer[]>;
}

const AnswerSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, required: true },
  author_id: { type: Schema.Types.ObjectId, required: true },
  answer: { type: String, required: true },
  date: { type: Date, required: true, default: Date },
  score: {
    upvotes: { type: [String], required: true, default: [] },
    downvotes: { type: [String], required: true, default: [] },
  },
});

AnswerSchema.pre('save', function _(this: AnswerDocument, next): any {
  this.answer = sanitize(this.answer);
  return next();
});


AnswerSchema.methods.isAuthor = async function _(author_id: string): Promise<boolean> {
  const match = await this.author_id.equals(author_id);
  return match;
};


AnswerSchema.methods.upVote = async function _(user_id: string): Promise<void> {
  if (this.score.upvotes.includes(user_id)) {
    this.score.upvotes = this.score.upvotes.filter((e: string) => e !== user_id);
  } else {
    this.score.downvotes = this.score.downvotes.filter((e: string) => e !== user_id);
    this.score.upvotes.push(user_id);
    this.set('score.upvotes', this.score.upvotes);
  }
  await this.save();
};


AnswerSchema.methods.downVote = async function _(user_id: string): Promise<void> {
  if (this.score.downvotes.includes(user_id)) {
    this.score.downvotes = this.score.downvotes.filter((e: string) => e !== user_id);
  } else {
    this.score.upvotes = this.score.upvotes.filter((e: string) => e !== user_id);
    this.score.downvotes.push(user_id);
    this.set('score.downvotes', this.score.downvotes);
  }
  await this.save();
};

AnswerSchema.methods.editData = async function _(new_data: DTO.Answer): Promise<void> {
  this.answer = new_data.answer ? new_data.answer : this.answer;
  await this.save();
};


async function toDto(answer: Answer): Promise<DTO.Answer> {
  const author = await User.findById(answer.author_id).lean();
  if (author) {
    const dto = {
      id: answer._id,
      author: { name: author.name, id: answer.author_id },
      answer: answer.answer,
      date: answer.date,
      score: answer.score.upvotes.length - answer.score.downvotes.length,
    } as DTO.Answer;

    return dto;
  }
  throw new Error('User not found');
}


AnswerSchema.statics.findAndLean = async function _(filter: {}): Promise<DTO.Answer[]> {
  const lean = await this.find(filter).lean();
  const answers = [] as Promise<DTO.Answer>[];
  lean.forEach((answer: Answer) => {
    answers.push(toDto(answer));
  });
  return Promise.all(answers);
};

export default mongoose.model<AnswerDocument, AnswerModel>('Answer', AnswerSchema);
