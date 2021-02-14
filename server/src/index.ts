import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
import connectPg from "connect-pg-simple";
import session from "express-session";
import express from "express";
import cors from "cors";
import { RegisterResolver } from "./module/user/Register";
import { RetrieveUserResolver } from "./module/user/RetrieveUser";
import { RetrievePostResolver } from "./module/post/RetrievePost";
import { CreatePostResolver } from "./module/post/CreatePost";
import { CreateCommentResolver } from "./module/comment/CreateComment";
import { UpvotePostResolver } from "./module/post/UpvotePost";
import { FollowResolver } from "./module/user/Follow";
import { LoginResolver } from "./module/user/Login";
import { MeResolver } from "./module/user/Me";
import { LogoutResolver } from "./module/user/Logout";
import { EditUserResolver } from "./module/user/EditUser";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      RetrieveUserResolver,
      RetrievePostResolver,
      CreatePostResolver,
      CreateCommentResolver,
      UpvotePostResolver,
      FollowResolver,
      LoginResolver,
      MeResolver,
      LogoutResolver,
      EditUserResolver,
    ],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  const pgStore = connectPg(session);

  app.use(
    session({
      store: new pgStore({
        conString: "pg://postgres:postgres@localhost:5432/postgres-demo",
      }),
      name: "qid",
      secret: "SESSION_SECRET_123",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  apolloServer.applyMiddleware({ app, cors: false });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server listening to port ${port}`));
};

main();
