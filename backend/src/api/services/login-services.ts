import User from '../models/user-model';
import * as DTO from '../../types';


export default {
  async signinUser(user: DTO.User): Promise<{ token: string; id: string }> {
    const registeredUser = await User.findOne({ email: user.email });

    if (!(registeredUser)) {
      throw Error('User not registered');
    }

    const isPasswordVerified = await registeredUser.verifyPassword(user.password);
    if (!isPasswordVerified) {
      throw Error('Wrong password');
    }

    const token = registeredUser.generateAuthToken();
    const { _id } = registeredUser;
    return { token, id: _id };
  },

  async signupUser(user: DTO.User): Promise<{ id: string }> {
    if (await User.findOne({ email: user.email })) {
      throw Error('User already registered');
    }

    const newUser = new User({
      name: user.name,
      password: user.password,
      email: user.email,
    });
    await newUser.save();

    const { _id } = newUser;
    return { id: _id };
  },
};
