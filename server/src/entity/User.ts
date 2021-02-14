import { Field, InputType, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Comment } from "./Comment";

@ObjectType()
@InputType("UserInput")
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { length: 255 })
  email: string;

  @Field()
  @Column("varchar", { length: 255 })
  handle: string;

  @Column("text")
  password: string;

  @Field()
  @Column("varchar", { length: 255 })
  firstName: string;

  @Field()
  @Column("varchar", { length: 255 })
  lastName: string;

  @Field()
  fullName(): string {
    return this.firstName + " " + this.lastName;
  }

  @Field()
  @Column()
  age: number;

  @Field()
  @Column("varchar", { length: 255, nullable: true, default: "" })
  bio?: string;

  @Field()
  @Column("varchar", {
    length: 255,
    nullable: true,
    default: "https://react.semantic-ui.com/images/wireframe/image.png",
  })
  profilePic?: string;

  @Field(() => [Post])
  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.creator)
  comments: Comment[];

  @Field(() => [Post])
  @ManyToMany(() => Post, (post) => post.upvotes)
  upvotes: Post[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable()
  followers: User[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.followers)
  following: User[];

  @Field(() => Number)
  numFollowers(): number {
    return this.followers.length;
  }

  @Field(() => Number)
  numFollowing(): number {
    return this.following.length;
  }

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
