import { Post } from "../../entity/Post";
import { User } from "../../entity/User";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { Comment } from "../../entity/Comment";
import { isAuth } from "../middleware/isAuth";
import { ContextType } from "../../type/ContextType";

@Resolver()
export class CreateCommentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Comment)
  async createComment(
    @Arg("postId") postId: number,
    @Arg("message") message: string,
    @Ctx() ctx: ContextType
  ): Promise<Comment> {
    const post = await Post.findOne(
      { id: postId },
      { relations: ["comments"] }
    );
    const creator = await User.findOne({ id: ctx.req.session!.userId });

    if (!creator) throw new Error("User not logged in");

    if (!post) throw new Error("Post does not exist");

    return await Comment.create({
      message,
      post: post,
      creator: creator,
    }).save();
  }
}
