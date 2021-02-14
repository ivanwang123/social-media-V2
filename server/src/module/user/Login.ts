import { User } from "../../entity/User";
import { ContextType } from "../../type/ContextType";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";

@Resolver()
export class LoginResolver {
  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: ContextType
  ): Promise<User> {
    const user = await User.findOne({ email });

    if (!user) throw new Error("Email is not registered");

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error("Incorrect password");

    ctx.req.session!.userId = user.id;

    return user;
  }
}
