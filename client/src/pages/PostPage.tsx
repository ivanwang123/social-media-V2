import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Segment,
  Comment,
  Loader,
  Dimmer,
  FormProps,
} from "semantic-ui-react";
import Post from "../components/Post";
import PostComment from "../components/PostComment";
import { AuthContext } from "../context/authContext";
import { CREATE_COMMENT_MUTATION } from "../graphql/comment/mutation";
import {
  RETRIEVE_POST_COMMENTS_QUERY,
  RETRIEVE_POST_QUERY,
} from "../graphql/post/query";

interface RetrievePostVar {
  id: number;
}

interface CreateCommentVar {
  postId: number;
  message: string;
}

function PostPage(props: any) {
  const postId: number = parseFloat(props.match.params.id);

  const authContext = useContext(AuthContext);

  const [commentMsg, setCommentMsg] = useState<string>("");

  const { loading, error, data, refetch } = useQuery<any, RetrievePostVar>(
    RETRIEVE_POST_QUERY,
    {
      variables: { id: postId },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  );
  const [retrieveComments, { data: commentsData }] = useLazyQuery<
    any,
    RetrievePostVar
  >(RETRIEVE_POST_COMMENTS_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [createCommentMutation] = useMutation<any, CreateCommentVar>(
    CREATE_COMMENT_MUTATION
  );

  const handleCreateComment = async () => {
    if (commentMsg.length) {
      await createCommentMutation({
        variables: {
          postId: postId,
          message: commentMsg,
        },
      });
      retrieveComments({
        variables: {
          id: postId,
        },
      });
      setCommentMsg("");
    }
  };

  useEffect(() => {
    retrieveComments({
      variables: {
        id: postId,
      },
    });
  }, []);

  if (error) return <h1>Error: {error.message}</h1>;

  return (
    <div className="margin-top-container">
      <Grid centered>
        <Grid.Column width={10}>
          <Post
            loading={loading}
            data={data?.retrievePost}
            comments={commentsData?.retrievePost.comments}
            refetch={refetch}
          />
          <Segment>
            <h4>Post a comment</h4>
            <Form reply onSubmit={handleCreateComment}>
              <Form.TextArea
                className="unresizable"
                placeholder={
                  authContext.me ? "Your comment..." : "Login to write comments"
                }
                value={commentMsg}
                onChange={(e) => setCommentMsg(e.target.value)}
                autoFocus
                disabled={!authContext.me}
              />
              <Button
                content="Submit"
                labelPosition="left"
                icon="edit"
                primary
                disabled={!authContext.me}
              />
            </Form>
          </Segment>
          <Comment.Group>
            <Header as="h3" dividing>
              Comments
            </Header>
            {loading ? (
              <Loader active inline="centered">
                Loading...
              </Loader>
            ) : (
              <>
                {commentsData &&
                  commentsData.retrievePost.comments.map((data: any) => {
                    return <PostComment data={data} />;
                  })}
              </>
            )}
          </Comment.Group>
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default PostPage;
