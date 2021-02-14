import { User } from "../../entity/User";
import { ContextType } from "../../type/ContextType";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class MeResolver {
  @Query(() => Boolean)
  async isAuth(@Ctx() ctx: ContextType): Promise<Boolean> {
    return ctx.req.session!.userId ? true : false;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ContextType): Promise<User | undefined> {
    if (!ctx.req.session!.userId) {
      return undefined;
    }

    return User.findOne({ id: ctx.req.session!.userId });
  }
}
