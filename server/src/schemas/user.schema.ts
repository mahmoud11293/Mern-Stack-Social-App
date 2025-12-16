import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    lowercase: true,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  dateOfBirth: string;

  @Prop({
    type: String,
    enum: ['male', 'female'],
  })
  gender: string;

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

export const UserSchema = SchemaFactory.createForClass(User);
export const userModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
