import Question from '../models/question-model';
import Answer from '../models/answer-model';
import User from '../models/user-model';
import Qodex from '../models/qodex-model';
import * as DTO from '../../types';


export default {
  // Get stats
  async getStats(user_id: string): Promise<DTO.Stats> {
    const qodexes_count = Qodex.estimatedDocumentCount();
    const questions_count = Question.estimatedDocumentCount();
    const answers_count = Answer.estimatedDocumentCount();
    const users_count = User.estimatedDocumentCount();
    const my_questions_count = Question.countDocuments({ author_id: user_id });
    const my_answers_count = Answer.countDocuments({ author_id: user_id });

    const res = await Promise.all([
      qodexes_count,
      questions_count,
      answers_count,
      users_count,
      my_questions_count,
      my_answers_count,
    ]);

    const [qodexes, questions, answers, users, my_questions, my_answers] = res;
    const stats = {
      qodexes_count: qodexes,
      questions_count: questions,
      answers_count: answers,
      users_count: users,
      my_questions_count: my_questions,
      my_answers_count: my_answers,
    } as DTO.Stats;

    return stats;
  },
};
