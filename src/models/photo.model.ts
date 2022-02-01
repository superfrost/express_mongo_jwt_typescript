import mongoose, { Schema, model, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface Photo extends mongoose.Document {
    albumId: Types.ObjectId;
    title: string;
    url: string;
    thumbnailUrl: string;
    owner: Types.ObjectId;
  }

// - photos (albumId (ref to album collection), title, url, thumbnailUrl, owner (ref to users collection))
const photoSchema = new Schema<Photo>({
    albumId: {type: Schema.Types.ObjectId, ref: 'album' },
    title: { type: String, required: true },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId,  ref: 'users' },
})

photoSchema.plugin(mongoosePaginate);

export default model('photos', photoSchema)