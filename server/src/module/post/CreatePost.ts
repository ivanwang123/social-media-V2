import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { ContextType } from "../../type/ContextType";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class CreatePostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Arg("content") content: string,
    @Ctx() ctx: ContextType
  ): Promise<Post> {
    const creator = await User.findOne(
      { id: ctx.req.session!.userId },
      { relations: ["posts"] }
    );

    if (creator) {
      return await Post.create({
        title,
        content,
        creator: creator,
        upvotes: [],
      }).save();
    }
    throw new Error("User not logged in");
  }
}
