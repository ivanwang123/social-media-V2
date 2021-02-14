import { gql } from "@apollo/client";

export const IS_AUTH_QUERY = gql`
  query IsAuth {
    isAuth
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      handle
      fullName
    }
  }
`;

export const RETRIEVE_USER_QUERY = gql`
  query RetrieveUser($handle: String!) {
    retrieveUser(handle: $handle) {
      id
      handle
      fullName
      age
      bio
      profilePic
      createdAt
      posts {
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
      followers {
        id
      }
      following {
        id
      }
    }
  }
`;

export const COMMENTED_QUERY = gql`
  query Commented($handle: String!) {
    commented(handle: $handle) {
      comments {
        id
        message
        createdAt
        post {
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
        creator {
          handle
          fullName
          profilePic
        }
      }
    }
  }
`;
export const UPVOTED_QUERY = gql`
  query Upvoted($handle: String!) {
    upvoted(handle: $handle) {
      upvotes {
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
  }
`;
