/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Schema, Document } from 'mongoose';
import mongoose from '../../loader/mongo-loader';
import User from './user-model';
import Qodex from './qodex-model';
import sanitize from './sanitize';
import * as DTO from '../../types';

interface Question {
  _id: any;
  author_id: string;
  qodex_id: string;
  title: string;
  question: string;
  tags: string[];
  date: string;
  score: { upvotes: string[]; downvotes: string[] };
  answers_id: string[];
  selected_answer_id: string;
}

interface QuestionDocument extends Document, Question {
    isAuthor(author_id: string): Promise<boolean>;
    upVote(user_id: string): Promise<void>;
    downVote(user_id: string): Promise<void>;
    editData(new_data: DTO.Question): Promise<void>;
}

interface QuestionModel extends Model<QuestionDocument> {
    findAndLean(filter: {}, limit?: number): Promise<DTO.Question[]>;
    findByIdAndLean(id: string): Promise<DTO.Question>;
}

const QuestionSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, required: true },
  qodex_id: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  question: { type: String, required: true },
  tags: { type: [String] },
  date: { type: Date, required: true, default: Date },
  score: {
    upvotes: { type: [String], required: true, default: [] },
    downvotes: { type: [String], required: true, default: [] },
  },
  answers_id: { type: [Schema.Types.ObjectId] },
  selected_answer_id: { type: Schema.Types.ObjectId },
});


QuestionSchema.pre('save', function _(this: QuestionDocument, next): any {
  this.question = sanitize(this.question);
  return next();
});

// Index for full text search
QuestionSchema.index({ title: 'text', tags: 'text' });


QuestionSchema.methods.isAuthor = async function isAuthor(author_id: string): Promise<boolean> {
  const match = await this.author_id.equals(author_id);
  return match;
};


QuestionSchema.methods.upVote = async function upVote(user_id: string): Promise<void> {
  if (this.score.upvotes.includes(user_id)) {
    this.score.upvotes = this.score.upvotes.filter((e: string) => e !== user_id);
  } else {
    this.score.downvotes = this.score.downvotes.filter((e: string) => e !== user_id);
    this.score.upvotes.push(user_id);
    this.set('score.upvotes', this.score.upvotes);
  }
  await this.save();
};


QuestionSchema.methods.downVote = async function downVote(user_id: string): Promise<void> {
  if (this.score.downvotes.includes(user_id)) {
    this.score.downvotes = this.score.downvotes.filter((e: string) => e !== user_id);
  } else {
    this.score.upvotes = this.score.upvotes.filter((e: string) => e !== user_id);
    this.score.downvotes.push(user_id);
    this.set('score.downvotes', this.score.downvotes);
  }
  await this.save();
};


QuestionSchema.methods.editData = async function _(new_data: DTO.Question): Promise<void> {
  this.title = new_data.title ? new_data.title : this.title;
  this.question = new_data.question ? new_data.question : this.question;
  this.qodex_id = new_data.qodex ? new_data.qodex.id : this.qodex_id;
  if (new_data.selected_answer_id) {
    if (this.selected_answer_id) {
      if (this.selected_answer_id.toString() === new_data.selected_answer_id) {
        this.selected_answer_id = undefined;
      }
    } else {
      this.selected_answer_id = this.answers_id.includes(new_data.selected_answer_id)
        ? new_data.selected_answer_id : this.selected_answer_id;
    }
  }
  await this.save();
};


async function toDto(question: Question): Promise<DTO.Question> {
  const author = await User.findById(question.author_id).lean();
  const qodex = await Qodex.findById(question.qodex_id).lean();

  if (author) {
    const dto = {
      id: question._id,
      author: { name: author.name, id: question.author_id },
      qodex: { name: qodex.name, id: question.qodex_id },
      title: question.title,
      question: question.question,
      tags: question.tags,
      date: question.date,
      score: question.score.upvotes.length - question.score.downvotes.length,
      answers_count: question.answers_id.length,
      selected_answer_id: question.selected_answer_id,
    } as DTO.Question;
    return dto;
  }
  throw new Error('User does not exists');
}


// eslint-disable-next-line max-len
QuestionSchema.statics.findAndLean = async function _(filter: {}, limit?: number): Promise<DTO.Question[]> {
  let lean;
  if (limit) {
    lean = await this.find(filter).sort('-date').limit(limit).lean();
  } else {
    lean = await this.find(filter).sort('-date').lean();
  }
  const questions = [] as Promise<DTO.Question>[];
  lean.forEach((question: Question) => {
    questions.push(toDto(question));
  });
  return Promise.all(questions);
};


QuestionSchema.statics.findByIdAndLean = async function _(id: string): Promise<DTO.Question> {
  const question = await this.findById(id).lean() as Question;
  return toDto(question);
};


export default mongoose.model<QuestionDocument, QuestionModel>('Question', QuestionSchema);
