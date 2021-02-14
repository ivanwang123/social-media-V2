import { Post } from "../../entity/Post";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class RetrievePostResolver {
  @Query(() => Post)
  async retrievePost(@Arg("id") id: number): Promise<Post> {
    const post = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.creator", "creator")
      .leftJoinAndSelect("post.upvotes", "upvotes")
      .leftJoinAndSelect("post.comments", "comments")
      .leftJoinAndSelect("comments.creator", "commentsCreator")
      .orderBy("comments.createdAt", "DESC")
      .where("post.id = :id", { id })
      .getOne();

    if (post) {
      return post;
    }
    throw new Error("Post does not exist");
  }

  @Query(() => [Post])
  async postsPagination(
    @Arg("offset") offset: number,
    @Arg("limit") limit: number
  ): Promise<Post[]> {
    const posts = await Post.createQueryBuilder("post")
      .leftJoinAndSelect("post.creator", "creator")
      .leftJoinAndSelect("post.upvotes", "upvotes")
      .leftJoinAndSelect("post.comments", "comments")
      .leftJoinAndSelect("comments.creator", "commentsCreator")
      .orderBy("post.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getMany();

    if (posts) {
      return posts;
    }
    throw new Error("Posts do not exist");
  }
}
