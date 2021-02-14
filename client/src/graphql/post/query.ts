import { gql } from "@apollo/client";

export const RETRIEVE_POST_QUERY = gql`
  query RetrievePost($id: Float!) {
    retrievePost(id: $id) {
      id
      title
      content
      createdAt
      creator {
        handle
        fullName
        profilePic
      }
      upvotes {
        id
      }
      comments {
        id
      }
    }
  }
`;

export const RETRIEVE_POST_COMMENTS_QUERY = gql`
  query RetrievePostComments($id: Float!) {
    retrievePost(id: $id) {
      comments {
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
  }
`;

export const POSTS_PAGINATION_QUERY = gql`
  query PostsPagination($offset: Float!, $limit: Float!) {
    postsPagination(offset: $offset, limit: $limit) {
      id
      title
      content
      createdAt
      creator {
        handle
        fullName
        profilePic
      }
      upvotes {
        id
      }
      comments {
        id
      }
    }
  }
`;
