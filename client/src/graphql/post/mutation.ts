import { gql } from "@apollo/client";

export const UPVOTE_MUTATION = gql`
  mutation Upvote($postId: Float!) {
    upvote(postId: $postId) {
      id
      upvotes {
        id
      }
    }
  }
`;

export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!) {
    createPost(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;
