import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";
import { ContextType } from "../../type/ContextType";

@Resolver()
export class UpvotePostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Post, { nullable: true })
  async upvote(
    @Arg("postId") postId: number,
    @Ctx() ctx: ContextType
  ): Promise<Post | null> {
    const post = await Post.findOne({ id: postId }, { relations: ["upvotes"] });
    const user = await User.findOne({ id: ctx.req.session!.userId });

    if (post && user) {
      const didUpvote = post.upvotes.filter(
        (upvoteUser) => upvoteUser.id !== user.id
      );

      if (didUpvote.length < post.upvotes.length) {
        post.upvotes = didUpvote;
      } else {
        post.upvotes = [user, ...post.upvotes];
      }

      await post.save();

      return post;
    }
    return null;
  }
}
