import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    type: String,
    trim: true,
  })
  text?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  owner: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  })
  post: string;

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
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
export const CommentModel = MongooseModule.forFeature([
  { name: Comment.name, schema: CommentSchema },
]);
