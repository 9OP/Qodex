/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
import Question from '../models/question-model';
import Answer from '../models/answer-model';
import User from '../models/user-model';
import Qodex from '../models/qodex-model';
import * as DTO from '../../types';


export default {
  // Get questions
  async getQuestions(search: string, limit: number): Promise<DTO.Question[]> {
    const filter = search ? { $text: { $search: search } } : {};
    const questions = await Question.findAndLean(filter, limit);
    return questions;
  },


  // Get favorite questions
  async getFavoriteQuestions(user_id: string): Promise<DTO.Question[]> {
    const user = await User.findById(user_id).lean();
    const filter = { _id: { $in: user.favorite_questions } };
    const favorite_questions = await Question.findAndLean(filter);
    return favorite_questions;
  },


  // Get users questions
  async getUserQuestions(user_id: string): Promise<DTO.Question[]> {
    const filter = { author_id: user_id };
    const favorite_questions = await Question.findAndLean(filter);
    return favorite_questions;
  },


  // Post question
  async postQuestion(question: DTO.Question): Promise<string> {
    // check qodex id is valid
    const doesQodexExists = await Qodex.exists({ _id: question.qodex.id });
    if (doesQodexExists) {
      const newQuestion = new Question(
        {
          title: question.title,
          question: question.question,
          tags: question.tags,
          qodex_id: question.qodex.id,
          author_id: question.author.id,
        },
      );
      await newQuestion.save();
      const { _id } = newQuestion;
      await Qodex.findByIdAndUpdate(question.qodex.id, { $push: { questions_id: _id } });
      return _id;
    }
    throw new Error('Qodex does not exists');
  },


  // Get thread by question id
  async getQuestion(question_id: string): Promise<{question: DTO.Question; answers: DTO.Answer[]}> {
    const doesQuestionExists = await Question.exists({ _id: question_id });

    if (doesQuestionExists === true) {
      const question = await Question.findByIdAndLean(question_id);
      const answers = await Answer.findAndLean({ question_id });
      if (question) {
        return { question, answers };
      }
    }
    throw new Error('question not found');
  },


  // Post answer
  async postAnswer(answer: DTO.Answer, question_id: string): Promise<void> {
    const doesQuestionExists = await Question.exists({ _id: question_id });

    if (doesQuestionExists === true) {
      const newAnswer = new Answer(
        {
          answer: answer.answer,
          author_id: answer.author.id,
          question_id,
        },
      );
      await newAnswer.save();
      const { _id } = newAnswer;

      await Question.findByIdAndUpdate(question_id, { $push: { answers_id: _id } });
      return _id;
    }
    throw new Error('question not found');
  },


  // Patch question
  async patchQuestion(patch: DTO.Question, vote: string): Promise<void> {
    const question = await Question.findById(patch.id);
    if (question) {
      const isAuthor = await question.isAuthor(patch.author.id);
      if (vote === 'upvote') await question.upVote(patch.author.id);
      else if (vote === 'downvote') await question.downVote(patch.author.id);
      if (isAuthor) await question.editData(patch);
    } else {
      throw new Error('question not found');
    }
  },


  // Patch answer
  async patchAnswer(patch: DTO.Answer, vote: string): Promise<void> {
    const answer = await Answer.findById(patch.id);
    if (answer) {
      const isAuthor = await answer.isAuthor(patch.author.id);
      if (vote === 'upvote') await answer.upVote(patch.author.id);
      if (vote === 'downvote') await answer.downVote(patch.author.id);
      if (isAuthor) await answer.editData(patch);
    } else {
      throw new Error('answer not found');
    }
  },
};
