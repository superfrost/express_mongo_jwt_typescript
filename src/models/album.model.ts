import mongoose, { Schema, model } from 'mongoose';
import photoModel from './photo.model';
;


export interface Album extends mongoose.Document {
    title: string;
    owner: Schema.Types.ObjectId;
  }

// - albums (title, owner)
const albumSchema = new Schema<Album>({
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId,  ref: 'users' },
})

albumSchema.pre("remove", async function (next) {
    const album = this as Album;
    await photoModel.deleteMany({ albumId: album._id });
    console.log("success delete cascade photos");
    next();
  });

export default model('albums', albumSchema)