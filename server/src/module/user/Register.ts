import { User } from "../../entity/User";
import { Arg, Mutation, Resolver } from "type-graphql";
import { RegisterInput } from "./register/RegisterInput";
import bcrypt from "bcryptjs";

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(
    @Arg("data")
    {
      email,
      password,
      firstName,
      lastName,
      bio,
      handle,
      profilePic,
      age,
    }: RegisterInput
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    return await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      bio,
      handle,
      profilePic,
      age,
      posts: [],
      comments: [],
      upvotes: [],
      followers: [],
      following: [],
    }).save();
  }
}
