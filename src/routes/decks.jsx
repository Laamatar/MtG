import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Offcanvas, ListGroup, Button, OverlayTrigger, Popover, ListGroupItem, FormControl } from 'react-bootstrap';
import Decklist from './decklist';
import uniqid from "uniqid"

export default function Decks() {

    const [currentDeck, setCurrentDeck] = useState(0)
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(true)


    const handleClose = () => setShow(false);

    useEffect(() => {

        setLoading(true)
        var decksInLS = JSON.parse(localStorage.getItem("decks"))
        setCurrentDeck(0)
        setLoading(false)
        if (JSON.parse(localStorage.getItem("decks") != undefined)) {
            console.log(JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist)
        }

        // if(JSON.parse(localStorage.getItem("decktoedit")).name == ""){
        //     //do stuff
        //     localStorage.setItem("decktoedit", JSON.stringify({name: "", decklist: []}))
        // }


    }, []);


    function handleSubmit(e) {
        e.preventDefault();
        setCurrentDeck(e.target.elements.decknumber.value)
        console.log(e.target.elements.decknumber.value)
        console.log(JSON.parse(localStorage.getItem("decks"))[e.target.elements.decknumber.value])
    }

    return (
        <Container style={{ minHeight: "100vh" }}>
            <div style={{ height: "5vh" }} />

            {loading ? <div />
                :
                <Row className='align-content-center justify-content-center text-center'>
                    <Col xs={12} sm={5} md={4} xl={3} xxl={2} className='border rounded'>
                        <h6 className='my-4'>Decks:</h6>
                        {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).map(function (deck, i) {
                            return (
                                <Form onSubmit={handleSubmit} key={uniqid()}>
                                    <Form.Control
                                        className='d-none'
                                        type="number"
                                        id="decknumber"
                                        name="decknumber"
                                        value={i}
                                        readOnly
                                        key={uniqid()}

                                    />
                                    <Container className='my-2' key={uniqid()}>
                                        <Button variant='outline-primary' style={{ width: "100%" }} type='submit' key={uniqid()}>
                                            {deck.name}
                                        </Button>
                                    </Container>
                                </Form>
                            )
                        }) : console.log("")}
                    </Col>
                    
                    {JSON.parse(localStorage.getItem("decks")) != undefined
                            ? 
                    <Col className='border rounded mx-2'>

                        <h6 className='my-4'>Deck: {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </h6>
                        <h6 className='my-4'>Cards:</h6>
                        <ListGroup className='mb-4'>
                           {JSON.parse(localStorage.getItem("decks")) != undefined ? <Decklist fromDecks={true} deck={JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist}></Decklist> : <div/> } 

                        </ListGroup>
                        <Row className='align-content-center justify-content-center text-center'>
                            <Button className='mt-4 ' variant='outline-primary' style={{ width: "40%" }}>Show decklist</Button>
                        </Row>
                        <Row className='align-content-center justify-content-end text-center'>

                            <Button className='my-4 me-4' variant='danger' style={{ width: "7rem" }}>Delete deck</Button>
                        </Row>
                            
                    </Col>
                    : <div />
                }
                </Row>
            }

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Decklist</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <pre>
                        {/* {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} */}

                        <br />
                        <br />
                        asd x 1
                        <br />
                        gdföglm x 2
                    </pre>
                </Offcanvas.Body>
            </Offcanvas>

        </Container>
    )
}