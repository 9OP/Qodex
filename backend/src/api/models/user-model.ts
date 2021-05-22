/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from '../../loader/mongo-loader';
import config from '../../config';
import * as DTO from '../../types';


interface User {
  _id: any;
  name: string;
  password: string;
  email: string;
  is_admin: boolean;
  favorite_questions: string[];
}

interface UserDocument extends Document, User {
  generateAuthToken(): string;
  verifyPassword(plain: string): Promise<boolean>;
}

interface UserModel extends Model<UserDocument> {
  findByIdAndLean(id: string): Promise<DTO.User>;
}


const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_admin: { type: Boolean, required: true, default: false },
  favorite_questions: { type: [Schema.Types.ObjectId] },
});


UserSchema.methods.generateAuthToken = function _(): string {
  const { _id, is_admin } = this;
  const secret = config.app.PRIVATE_KEY;
  const token = jwt.sign({ id: _id, is_admin }, secret);
  return token;
};

UserSchema.methods.verifyPassword = async function _(plain: string): Promise<boolean> {
  const match = await bcrypt.compare(plain, this.password);
  return match;
};


// eslint-disable-next-line consistent-return
UserSchema.pre('save', function hashPassword(next): void | Promise<unknown> {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user: UserDocument = this as UserDocument;
  // only hash the password if it has been modified (or is new)
  // if (!user.isModified('password')) return next();
  // hash the password using our new salt
  bcrypt.hash(user.password, 10, (err, hash): unknown => {
    // if (err) return next(err);
    // override the cleartext password with the hashed one
    user.password = hash;
    return next();
  });
});

async function toDto(user: User): Promise<DTO.User> {
  const dto = {
    id: user._id,
    name: user.name,
    email: user.email,
    is_admin: user.is_admin,
    favorite_questions: user.favorite_questions,
  } as DTO.User;
  return dto;
}


UserSchema.statics.findByIdAndLean = async function _(id: string): Promise<DTO.User> {
  const user = await this.findById(id).lean() as User;
  return toDto(user);
};

export default mongoose.model<UserDocument, UserModel>('User', UserSchema);
