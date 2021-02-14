import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $handle: String!
    $age: Float!
  ) {
    register(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        handle: $handle
        age: $age
      }
    ) {
      id
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      handle
      email
      firstName
      lastName
      age
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const FOLLOW_MUTATION = gql`
  mutation Follow($followUserId: Float!) {
    follow(followUserId: $followUserId) {
      id
      followers {
        id
      }
      following {
        id
      }
    }
  }
`;

export const EDIT_USER_MUTATION = gql`
  mutation EditUser($profilePic: String!, $bio: String!) {
    editUser(data: { profilePic: $profilePic, bio: $bio })
  }
`;
