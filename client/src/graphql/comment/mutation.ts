import { gql } from "@apollo/client";

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($postId: Float!, $message: String!) {
    createComment(postId: $postId, message: $message) {
      id
      message
      createdAt
      creator {
        handle
        fullName
        profilePic
      }
    }
  }
`;
