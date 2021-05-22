import Joi from '@hapi/joi';
import * as DTO from '../../../types';

export default {
  async Qodex(qodex: DTO.Qodex): Promise<DTO.Qodex> {
    const qodexSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    });

    return qodexSchema.validateAsync(qodex);
  },
};
