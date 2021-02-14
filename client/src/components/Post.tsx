import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  Header,
  Icon,
  Image,
  Label,
  Placeholder,
} from "semantic-ui-react";
import { RetrievePostType } from "../type/PostType";
import { DateTime } from "luxon";
import { UPVOTE_MUTATION } from "../graphql/post/mutation";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../context/authContext";

interface UpvoteVar {
  postId: number;
}

interface UpvoteType {
  id: number;
}

interface UpvoteDataType {
  numUpvotes: number;
  didUpvote: boolean;
}

interface PropType {
  loading: boolean;
  data: RetrievePostType;
  comments?: any;
  refetch?: any;
}

function Post({ loading, data, comments, refetch }: PropType) {
  const authContext = useContext(AuthContext);

  const [upvoteMutation] = useMutation<any, UpvoteVar>(UPVOTE_MUTATION, {
    errorPolicy: "all",
  });

  const [upvoteData, setUpvoteData] = useState<UpvoteDataType>({
    numUpvotes: 0,
    didUpvote: false,
  });

  const handleUpvote = async () => {
    await upvoteMutation({
      variables: { postId: data.id },
    });
    if (refetch) refetch();
  };

  useEffect(() => {
    if (data) {
      const upvotes: UpvoteType[] = Array.from(new Set(data.upvotes));
      let newUpvoteData: UpvoteDataType = {
        numUpvotes: upvotes.length,
        didUpvote: false,
      };

      if (authContext.me) {
        let upvoted = upvotes.filter(
          (upvote) => upvote.id === authContext.me!.id
        );
        if (upvoted.length) {
          newUpvoteData.didUpvote = true;
        }
      }

      setUpvoteData(newUpvoteData);
    }
  }, [authContext.me, data?.upvotes]);

  if (loading)
    return (
      <Card fluid>
        <Card.Content>
          <Placeholder fluid>
            <Placeholder.Header>
              <Placeholder.Line length="short" />
              <Placeholder.Line length="very short" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
      </Card>
    );

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <Link to={`/post/${data.id}`} className="link-color">
            {data.title}
          </Link>
          <Link
            to={`/profile/${data?.creator.handle}`}
            className="mini-profile-wrapper"
          >
            <span>{data?.creator.fullName}</span>
            <Image
              floated="right"
              size="small"
              src={data?.creator.profilePic}
              avatar
              bordered
            />
          </Link>
        </Card.Header>
        <Card.Meta>
          {DateTime.fromISO(data.createdAt).toLocaleString({
            month: "short",
            day: "numeric",
          })}
        </Card.Meta>
        <Card.Description>{data.content}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Label
          as="a"
          onClick={handleUpvote}
          {...(upvoteData.didUpvote ? { color: "red" } : "")}
        >
          <Icon name="heart" />
          {upvoteData.numUpvotes}
        </Label>
        <Label as={Link} to={`/post/${data.id}`}>
          <Icon name="comment" />
          {comments ? comments.length : data.comments.length}
        </Label>
      </Card.Content>
    </Card>
  );
}

export default Post;
