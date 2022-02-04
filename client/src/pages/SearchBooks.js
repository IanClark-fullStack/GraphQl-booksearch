import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, Accordion, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import Auth from '../utils/auth';


const SearchBooks = () => {
  // create state for holding returned google api data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');

  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK);
  
  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });


  
  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
      // saveBook callback fn is invoked when we dispatch the SAVE_BOOK Mutation
  
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
  
    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const response = await saveBook({
        variables: {
          input: bookToSave
        }, 
      });
      // const response = await saveBook(bookToSave, token);

      // if (!response.ok) {
      //   console.log(response)
      //   throw new Error('something went wrong!');
      // }

      // if book successfully saves to user's account, save book id to state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <>
      <Jumbotron fluid className='mocha bg-offwhite'>
        <Container>
          <h1 className='display-1'>Build your Collection</h1>
          <p className='subtitle'>by Title, Author or ISBN</p>
          <Form onSubmit={handleFormSubmit}>
            <Form.Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='foil' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Jumbotron>

      <Container>
        <h2>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        
        <Row xs={1} md={2} className='mb-4'>
          {searchedBooks.map((book, index) => {
            return (
              <Card key={book.bookId} className='border-0 mx-5 mx-md-0'>
                <Row xs={1} md={2} className='mb-4'>
                  <Col xs={3} md={3} className='bookRow'>
    
                    {book.image ? (
                      <div className='locandina' style={{backgroundImage: `url("${book.image}")`}} alt={`The cover for ${book.title}`} />
                      // <Card.Img className='card-image-left' src={book.image} alt={`The cover for ${book.title}`} />
                    ) : null}
                    
                  </Col>
                  <Col xs={7} md={8} className='bookRow'>
                    <Card.Body>
                      <Card.Title className='bookTitle'>{book.title}</Card.Title>
                      <p className='bookAuthor'>Author: {book.authors}</p>
                        <Accordion style={{ border: 0 }}>

                          <Accordion.Toggle as={Button} variant="readButton" eventKey="0">
                              read more
                          </Accordion.Toggle>

                          {Auth.loggedIn() && (
                            <Button
                              disabled={savedBookIds?.some(
                                (savedId) => savedId === book.bookId
                              )}
                              variant='foil'
                              style={{marginLeft: '0.9rem'}} 
                              onClick={() => handleSaveBook(book.bookId)}
                            >
                            {savedBookIds?.some((savedId) => savedId === book.bookId)
                              ? 'In your collection'
                              : 'Save this Book!'}
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
        
        
        {/* </CardGroup> */}
        {/* <CardColumns>
          {searchedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='left' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book.bookId)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns> */}
         {/* <Col xs={12} md={10} className='mb-5'>
                <Accordion>
                  <Card className='border-0'> */}
                  {/* <Card.Title className='bookTitle'>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p> */}
                    {/* <Card.Body>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                            read more
                        </Accordion.Toggle>
                      </Card.Body>
                    <Accordion.Collapse eventKey="0">
                    
                      <Card key={book.bookId} className='border-0'>
                        <Row className="align-items-md-center mb-5">
                          <Card.Body>
                            <Card.Text className='subtitle'>{book.description}</Card.Text>
                          </Card.Body>
                        </Row>
                      </Card>
                    
                    </Accordion.Collapse>
                  </Card>
              </Accordion> */}
            {/* </Col> */}
            </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
