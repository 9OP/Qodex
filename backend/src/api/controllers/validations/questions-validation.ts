import Joi from '@hapi/joi';
import * as DTO from '../../../types';

type filter = {search: string; limit: number}

export default {
  async Question(question: DTO.Question): Promise<DTO.Question> {
    const questionSchema = Joi.object({
      title: Joi.string().required(),
      question: Joi.string().required(),
      tags: Joi.array().items(Joi.string()),
      qodex: { id: Joi.string().alphanum().required() },
      author: { id: Joi.string().alphanum().required() },
    });

    return questionSchema.validateAsync(question);
  },

  async QuestionFilter(filter: filter): Promise<filter> {
    const filterSchema = Joi.object({
      search: Joi.string(),
      limit: Joi.number(),
    });

    return filterSchema.validateAsync(filter);
  },

  async Answer(answer: DTO.Answer): Promise<DTO.Answer> {
    const answerSchema = Joi.object({
      answer: Joi.string().required(),
      author: { id: Joi.string().alphanum().required() }, // User._id
    });

    return answerSchema.validateAsync(answer);
  },

  async patchQuestion(question: DTO.Question): Promise<DTO.Question> {
    const questionSchema = Joi.object({
      id: Joi.string().alphanum().required(),
      title: Joi.string(),
      question: Joi.string(),
      qodex: { id: Joi.string().alphanum() },
      selected_answer_id: Joi.string().alphanum(), // Answer ._id
      author: { id: Joi.string().alphanum().required() }, // User._id
    });

    return questionSchema.validateAsync(question);
  },

  async patchAnswer(answer: DTO.Answer): Promise<DTO.Answer> {
    const answerSchema = Joi.object({
      id: Joi.string().alphanum().required(),
      answer: Joi.string(),
      author: { id: Joi.string().alphanum().required() }, // User._id
    });

    return answerSchema.validateAsync(answer);
  },
};
