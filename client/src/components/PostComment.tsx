import { DateTime } from "luxon";
import React from "react";
import { Link } from "react-router-dom";
import { Comment } from "semantic-ui-react";

function PostComment({ data }: any) {
  return (
    <Comment>
      <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
      <Comment.Content>
        <Comment.Author as={Link} to={`/profile/${data?.creator.handle}`}>
          {data?.creator.fullName}
        </Comment.Author>
        <Comment.Metadata>
          <div>
            {DateTime.fromISO(data?.createdAt).toLocaleString({
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </div>
        </Comment.Metadata>
        <Comment.Text>{data?.message}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
}

export default PostComment;
