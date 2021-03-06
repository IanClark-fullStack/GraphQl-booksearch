import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button, Accordion, Row, Col } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';



const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);

  const userData = data?.me || [];
  console.log(userData);
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

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
  return (
    <>
      <Jumbotron fluid className='mocha bg-offwhite'>
        <Container>
          <h1 className='display-1'>Your Collection</h1>
        <h2>
        {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        </Container>
      </Jumbotron>
      <Container>
        
        <Row xs={1} md={2} className='mb-4'>
        {userData.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} className='border-0'>
                <Row xs={1} md={2} className='mb-4'>
                  <Col xs={3} md={3} className='bookRow'>
    
                    {book.image ? (
                      <div className='locandina' style={{backgroundImage: `url("${book.image}")`}} alt={`The cover for ${book.title}`} />
                    ) : null}
                    
                  </Col>
                  <Col xs={9} md={8} className='bookRow'>
                    <Card.Body>
                      <Card.Title className='bookTitle'>{book.title}</Card.Title>
                      <p className='bookAuthor'>Author: {book.authors}</p>
                        <Accordion style={{ border: 0 }}>

                          <Accordion.Toggle as={Button} variant="delete" eventKey="0">
                              read more
                          </Accordion.Toggle>

                          {Auth.loggedIn() && (
                            <Button className='ml-3' variant='foil' onClick={() => handleDeleteBook(book.bookId)}>
                            Delete this Book!
                          </Button>
                          )}
                          <Accordion.Collapse eventKey="0">
                            <Row className="align-items-md-center mb-5">
                              <p className='subtitle ml-2'>{book.description}</p>
                            </Row>
                          </Accordion.Collapse>
                        </Accordion>
                      </Card.Body>
                    </Col>
                </Row>
              </Card>
            );
        })}
            </Row>
      </Container>
    </>
  );
};


export default SavedBooks;
