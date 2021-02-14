import { Field, InputType } from "type-graphql";

@InputType()
export class EditUserInput {
  @Field()
  profilePic: string;

  @Field()
  bio: string;
}
