import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id
      email
      username
      savedBooks {
        bookId
        authors
        image
        description
        link
        title
      }
    }
  }
`;
