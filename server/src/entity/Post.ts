import { Field, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@ObjectType()
@InputType("PostInput")
@Entity()
export class Post extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("varchar", { length: 255 })
  title: string;

  @Field()
  @Column()
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.upvotes)
  @JoinTable()
  upvotes: User[];

  @Field(() => Number)
  numComments(): number {
    return this.comments.length;
  }

  @Field(() => Number)
  numUpvotes(): number {
    return this.upvotes.length;
  }

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
