import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, Col, Form, Button, Card, Accordion, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import Auth from '../utils/auth';


const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });


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


  const handleSaveBook = async (bookId) => {
    
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
  
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

      </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
