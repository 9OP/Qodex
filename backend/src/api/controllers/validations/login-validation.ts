import Joi from '@hapi/joi';
import * as DTO from '../../../types';


export default {
  async UserLogin(user: DTO.User): Promise<DTO.User > {
    const userSchema = Joi.object({
      name: Joi.string().min(3).max(50),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(5).max(255).required(),
    });

    return userSchema.validateAsync(user);
  },

  async UserRegister(user: DTO.User): Promise<DTO.User > {
    const userSchema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().max(255).required(),
      password: Joi.string().min(5).max(255).required(),
    });

    return userSchema.validateAsync(user);
  },
};
