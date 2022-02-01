import { Schema, model, Types } from 'mongoose';

interface Token {
  userId: Types.ObjectId
  token: string;
}

const tokenSchema = new Schema<Token>({
  userId: { type: Types.ObjectId, ref: "users", required: true, },
  token: { type: String, required: true, }
})

export = model('tokens', tokenSchema)