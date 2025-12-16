import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: String,
  })
  body: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    default: [],
  })
  comments: mongoose.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  likes: mongoose.Types.ObjectId[];

  @Prop({
    type: {
      url: String,
      public_id: String,
    },
    required: false,
  })
  image?: {
    url: string;
    public_id: string;
  };

  @Prop({
    type: String,
    unique: true,
    required: false,
  })
  customId?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: false,
  })
  sharedFrom?: mongoose.Types.ObjectId;

  @Prop({
    type: Boolean,
    default: false,
  })
  isShared?: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
export const PostModel = MongooseModule.forFeature([
  { name: Post.name, schema: PostSchema },
]);
