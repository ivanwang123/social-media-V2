import { User } from "../../entity/User";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class RetrieveUserResolver {
  @Query(() => User)
  async retrieveUser(@Arg("handle") handle: string): Promise<User> {
    const user = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.followers", "followers")
      .leftJoinAndSelect("user.following", "following")
      .leftJoinAndSelect("user.posts", "posts")
      .leftJoinAndSelect("posts.creator", "creator")
      .leftJoinAndSelect("posts.upvotes", "upvotes")
      .leftJoinAndSelect("posts.comments", "comments")
      .orderBy("posts.createdAt", "DESC")
      .where("user.handle = :handle", { handle })
      .getOne();

    if (user) {
      return user;
    } else {
      throw new Error("User does not exist");
    }
  }

  @Query(() => User)
  async upvoted(@Arg("handle") handle: string): Promise<User> {
    const user = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.upvotes", "upvoted")
      .leftJoinAndSelect("upvoted.creator", "creator")
      .leftJoinAndSelect("upvoted.upvotes", "upvotes")
      .leftJoinAndSelect("upvoted.comments", "comments")
      .orderBy("upvoted.createdAt", "DESC")
      .where("user.handle = :handle", { handle })
      .getOne();

    if (user) {
      return user;
    } else {
      throw new Error("User does not exist");
    }
  }

  @Query(() => User)
  async commented(@Arg("handle") handle: string): Promise<User> {
    const user = await User.createQueryBuilder("user")
      .leftJoinAndSelect("user.comments", "commented")
      .leftJoinAndSelect("commented.creator", "creator")
      .leftJoinAndSelect("commented.post", "post")
      .leftJoinAndSelect("post.creator", "postCreator")
      .leftJoinAndSelect("post.upvotes", "postUpvotes")
      .leftJoinAndSelect("post.comments", "postComments")
      .orderBy("commented.createdAt", "DESC")
      .where("user.handle = :handle", { handle })
      .getOne();

    if (user) {
      return user;
    } else {
      throw new Error("User does not exist");
    }
  }
}
