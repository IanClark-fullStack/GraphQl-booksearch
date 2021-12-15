import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId, saveBookIds } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';



const SavedBooks = () => {
  // Parent Level Hooks
  // const [userData, setUserData] = useState({});
  const { loading, data } = useQuery(GET_ME);
  
  // userData = Either loading has finished so [] or The data we want
  const userData = data?.me || [];
  console.log(userData);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  // use this to determine if `useEffect()` hook needs to run again
  // const userDataLength = userData.savedBooks.length;
  // Bring in the query to dispatch GET_ME when Loading is not True

  // create function that accepts the book's mongo _id value as param and deletes the book from the database

  // useMutation for REMOVE_BOOK instead 
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    console.log(bookId);

    if (!token) {
      return false;
    }

    try {
        const response = await removeBook(
          { variables: { bookId: bookId } }
        );
        if (!response) {
          throw new Error('something went wrong!');
        }
        removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  

  if (loading) {
    return <h2>LOADING...</h2>;
  }
  // Missing piece
  const savedBookIds = userData.savedBooks.map((el) => el.bookId);
  saveBookIds(savedBookIds);

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};


export default SavedBooks;
