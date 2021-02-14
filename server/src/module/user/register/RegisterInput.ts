import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./IsEmailAlreadyExist";
import { IsHandleAlreadyExist } from "./IsHandleAlreadyExist";

@InputType()
export class RegisterInput {
  @IsEmailAlreadyExist({ message: "Email is already in use" })
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @IsHandleAlreadyExist({ message: "Handle is already in use" })
  @Field()
  handle: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  profilePic?: string;

  @Field()
  age: number;
}
