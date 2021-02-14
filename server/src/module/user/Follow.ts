import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { ContextType } from "../../type/ContextType";

@Resolver()
export class FollowResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async follow(
    @Arg("followUserId") followUserId: number,
    @Ctx() ctx: ContextType
  ): Promise<User | null> {
    const user = await User.findOne({ id: ctx.req.session!.userId });
    const followUser = await User.findOne(
      { id: followUserId },
      { relations: ["followers", "following"] }
    );

    if (user && followUser) {
      const didFollow = followUser.followers.filter(
        (follow) => follow.id !== user.id
      );

      if (didFollow.length < followUser.followers.length) {
        followUser.followers = didFollow;
      } else {
        followUser.followers = [user, ...followUser.followers];
      }
      await followUser.save();

      return followUser;
    }
    return null;
  }
}
