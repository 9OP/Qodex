import Question from '../models/question-model';
import User from '../models/user-model';
import * as DTO from '../../types';


export default {
  // Get user
  async getUser(user_id: string): Promise<DTO.User> {
    const user = await User.findByIdAndLean(user_id);
    return user;
  },

  // Add question to user's favorites
  async followQuestion(question_id: string, user_id: string): Promise<void> {
    // Check if question exists
    const doesQuestionExists = await Question.exists({ _id: question_id });

    // If so add it to user favorite
    if (doesQuestionExists === true) {
      const condition = {
        _id: user_id,
        favorite_questions: { $nin: question_id }, // avoid adding multiple time
      };
      await User.findOneAndUpdate(condition, { $push: { favorite_questions: question_id } });
    } else {
      throw new Error('Question does not exist');
    }
  },

  // Remove question from user's favorites
  async unfollowQuestion(question_id: string, user_id: string): Promise<void> {
    // Check if question exists
    const doesQuestionExists = await Question.exists({ _id: question_id });

    // If so remove it from user favorite
    if (doesQuestionExists === true) {
      const condition = {
        _id: user_id,
        favorite_questions: { $in: question_id }, // avoid adding multiple time
      };
      await User.findOneAndUpdate(condition, { $pull: { favorite_questions: question_id } });
    } else {
      throw new Error('Question does not exist');
    }
  },
};
