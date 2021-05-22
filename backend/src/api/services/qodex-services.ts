import Qodex from '../models/qodex-model';
import Question from '../models/question-model';
import * as DTO from '../../types';


export default {
  async getQodexes(): Promise<DTO.Qodex[]> {
    const qodexes = await Qodex.findAndLean({});
    return qodexes;
  },


  async getQodex(qodex_id: string): Promise<{qodex: DTO.Qodex; questions: DTO.Question[]}> {
    const doesQodexExists = await Qodex.exists({ _id: qodex_id });

    if (doesQodexExists === true) {
      const qodex = await Qodex.findByIdAndLean(qodex_id);
      const questions = await Question.findAndLean({ qodex_id: qodex.id });
      if (qodex) {
        return { qodex, questions };
      }
    }
    throw new Error('qodex not found');
  },

  async postQodex(qodex: DTO.Qodex): Promise<string> {
    const newQodex = new Qodex(
      {
        name: qodex.name,
        description: qodex.description,
      },
    );
    await newQodex.save();
    const { _id } = newQodex;
    return _id;
  },
};
