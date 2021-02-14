import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { EditUserInput } from "./register/EditUserInput";
import { ContextType } from "src/type/ContextType";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class EditUserResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async editUser(
    @Arg("data") { profilePic, bio }: EditUserInput,
    @Ctx() ctx: ContextType
  ): Promise<Boolean> {
    const update = await User.createQueryBuilder("user")
      .update<User>(User, { profilePic, bio })
      .where("id = :id", { id: ctx.req.session!.userId })
      .execute();

    if (update) {
      return true;
    } else {
      throw new Error("Unable to update profile");
    }
  }
}
