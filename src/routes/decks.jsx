import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Offcanvas, ListGroup, Button, OverlayTrigger, Popover, ListGroupItem, FormControl } from 'react-bootstrap';
import Decklist from './decklist';
import uniqid from "uniqid"
import { PieChart } from 'react-minimal-pie-chart';

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


    const [hoveredColor, setHoveredColor] = useState(undefined);
    const [hoveredType, setHoveredType] = useState(undefined);
    return (
        <div style={{ minHeight: "100vh", width: "100vw" }} className='d-flex mt-4'>

            {loading ? <div />
                :
                <Row className='d-flex' style={{ width: "100%" }}>
                    <Col xs={12} sm={12} md={4} xl={3} xxl={2} className='border rounded mx-4 my-2'>
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
                        <Col className='border rounded mx-4 my-2' xs={12} sm={12} md={6} xl={8} xxl={9}>

                            <h6 className='my-4'>Deck: {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </h6>
                            <h6 className='my-4'>Cards:</h6>
                            <ListGroup className='mb-4'>
                                {JSON.parse(localStorage.getItem("decks")) != undefined ? <Decklist fromDecks={true} deck={JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist}></Decklist> : <div />}

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
                    <Col xs={0} xl={0} xxl={1} />
                    <Col xs={12} xl={6} xxl={5} className='mt-4 px-4 align-content-center justify-content-center text-center'>
                        <PieChart
                            style={{
                                width: "30rem", fontFamily:
                                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                fontSize: '8px'
                            }}
                            radius={40}
                            onMouseOver={(_, index) => {
                                setHoveredColor(index);
                            }}
                            onMouseOut={() => {
                                setHoveredColor(undefined);
                            }}

                            label={({ dataEntry }) => (dataEntry.title === "White" && hoveredColor == 0) || (dataEntry.title === "Blue" && hoveredColor == 1) || (dataEntry.title === "Black" && hoveredColor == 2) || (dataEntry.title === "Red" && hoveredColor == 3) || (dataEntry.title === "Green" && hoveredColor == 4) ? Math.round(dataEntry.percentage) == 0 ? "" : Math.round(dataEntry.percentage) + '%' : ""}
                            labelPosition={70}
                            labelStyle={{
                                opacity: 0.75,
                                pointerEvents: 'none',
                            }}
                            data={[
                                { title: 'White', value: 5, color: '#ffecb8' },
                                { title: 'Blue', value: 15, color: '#4389bf' },
                                { title: 'Black', value: 20, color: '#5b4d78' },
                                { title: 'Red', value: 10, color: '#BD5858' },
                                { title: 'Green', value: 20, color: '#7fc29b' },
                            ]}
                        />
                    </Col>
                    <Col xs={12} xl={6} xxl={5} className='mt-4 px-4 align-content-center justify-content-center text-center'>
                        <PieChart
                            style={{
                                width: "30rem", fontFamily:
                                    '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                fontSize: '8px'
                            }}
                            radius={40}
                            onMouseOver={(_, index) => {
                                setHoveredType(index);
                            }}
                            onMouseOut={() => {
                                setHoveredType(undefined);
                            }}

                            label={({ dataEntry }) => (dataEntry.title === "Creature" && hoveredType == 0) || (dataEntry.title === "Land" && hoveredType == 1) || (dataEntry.title === "Instant" && hoveredType == 2) || (dataEntry.title === "Sorcery" && hoveredType == 3) || (dataEntry.title === "Others" && hoveredType == 4) ? Math.round(dataEntry.percentage) == 0 ? "" : Math.round(dataEntry.percentage) + '%' : ""}
                            labelPosition={70}
                            labelStyle={{
                                opacity: 0.75,
                                pointerEvents: 'none',
                            }}
                            data={[
                                { title: 'Creature', value: 20, color: '#b07156' },
                                { title: 'Land', value: 24, color: '#3f4b3b' },
                                { title: 'Instant', value: 8, color: '#ab4e68' },
                                { title: 'Sorcery', value: 4, color: '#afbe8f' },
                                { title: 'Others', value: 4, color: '#dde392' },
                            ]}
                        />
                    </Col>
                    <Col xs={0} xl={0} xxl={1} />
                    <Row>
                        <Col xs={2} xl={6} xxl={6}></Col>
                        <Col xs={3} xl={2} xxl={2}>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={4} sm={6}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={0}></Col></Row>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={4} sm={6}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={0}></Col></Row>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={4} sm={6}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={0}></Col></Row>
                        </Col>
                        <Col xs={1} xl={2} xxl={1} />
                        <Col xs={3} xl={2} xxl={2}>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={1}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={4}></Col></Row>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={1}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={4}></Col></Row>
                            <Row className='align-content-center justify-content-center text-center'> <Col xs={1}></Col><Col xs={2} className='align-content-center justify-content-center me-3'>Land:</Col> <Col xs={2} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> <Col xs={4}></Col></Row>
                        </Col>
                        <Col xs={0} xl={0} xxl={1} />
                    </Row>
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

        </div>
    )
}