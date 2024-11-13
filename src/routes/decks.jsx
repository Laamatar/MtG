import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Offcanvas, ListGroup, Button, OverlayTrigger, Popover, ListGroupItem, FormControl } from 'react-bootstrap';
import Decklist from './decklist';
import uniqid from "uniqid"
import { PieChart } from 'react-minimal-pie-chart';
import { useNavigate } from 'react-router-dom';

export default function Decks() {

    const [currentDeck, setCurrentDeck] = useState(0)
    const [loading, setLoading] = useState(true)
    const [show, setShow] = useState(false)

    const navigate = useNavigate();

    const handleClose = () => setShow(false);

    useEffect(() => {
        setLoading(true)
        var decksInLS = JSON.parse(localStorage.getItem("decks"))
        setCurrentDeck(0)
        setLoading(false)
        fetchData();

        // if(JSON.parse(localStorage.getItem("decktoedit")).name == ""){
        //     //do stuff
        //     localStorage.setItem("decktoedit", JSON.stringify({name: "", decklist: []}))
        // }


    }, []);

    const [colors, setColors] = useState({ w: 0, u: 0, b: 0, r: 0, g: 0, c: 0 })
    const [types, setTypes] = useState({ l: 0, c: 0, i: 0, s: 0, o: 0 })
    const [cardNames, setCardNames] = useState([]);



    async function fetchData() {
        var promises = [];
        if (JSON.parse(localStorage.getItem("decks")).length != 0) {

            for (let i = 0; i < JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist.length; i++) {

                promises.push(getData(JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist[i].id));
            }
            setLoading(true)
            await Promise.all(promises).then(results => {

                console.log("index")
                var w = 0;
                var u = 0;
                var b = 0;
                var r = 0;
                var g = 0;
                var c = 0;
                var l = 0;
                var typec = 0;
                var i = 0;
                var s = 0;
                var o = 0;
                var cn = [];
                var hasType = false;
                for (let index = 0; index < results.length; index++) {
                    if (results[index].colors.includes("W")) {
                        w++;
                    } if (results[index].colors.includes("U")) {
                        u++;
                    } if (results[index].colors.includes("B")) {
                        b++;
                    } if (results[index].colors.includes("R")) {
                        r++;
                    } if (results[index].colors.includes("G")) {
                        g++;
                    } if (results[index].colors.length == 0) {
                        c++;
                    } if (results[index].type_line.includes("Land")) {
                        hasType = true;
                        l++;
                    } if (results[index].type_line.includes("Creature")) {
                        hasType = true;
                        typec++;
                    } if (results[index].type_line.includes("Instant")) {
                        hasType = true;
                        i++;
                    } if (results[index].type_line.includes("Sorcery")) {
                        hasType = true;
                        s++;
                    } if (!hasType) {
                        o++;
                    }
                    cn.push({ name: results[index].name, amount: JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist[index].amount })
                    hasType = false;
                }
                setColors({ w: w, u: u, b: b, r: r, g: g, c: c })
                setTypes({ l: l, c: typec, i: i, s: s, o: o })
                setCardNames(cn)
            }
            ).then(setLoading(false));
        }
    }

    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    console.log(result.code)
                    console.log(result.details)
                } else {

                    console.log(result)

                    return (result)
                }
            });

    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        var promises = [setCurrentDeck(e.target.elements.decknumber.value), fetchData()]
        await Promise.all(promises).then(setLoading(false))

        // console.log(e.target.elements.decknumber.value)
        // console.log(JSON.parse(localStorage.getItem("decks"))[e.target.elements.decknumber.value])
    }


    async function handleShow() {
        setShow(true);
    }

    async function editDeck() {
        var d = JSON.parse(localStorage.getItem("decks"))[currentDeck];
        console.log(d)
        localStorage.setItem("decktoedit", JSON.stringify(d))
        console.log(JSON.parse(localStorage.getItem("decktoedit")))
        navigate("/deckbuilder")
    }


    function deleteDeck() {
        var newDecks = [];
        for (let index = 0; index < JSON.parse(localStorage.getItem("decks")).length; index++) {
            if (index != currentDeck) {
                newDecks.push(JSON.parse(localStorage.getItem("decks"))[index])
            }

        }
        setCurrentDeck(0)
        if (newDecks.length != 0) {

            localStorage.setItem("decks", JSON.stringify(newDecks))
        } else {

            localStorage.setItem("decks", JSON.stringify([]))
        }
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
                        {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

                            JSON.parse(localStorage.getItem("decks")).map(function (deck, i) {
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
                            }) : console.log("") : console.log("")}
                    </Col>

                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0
                        ?
                        <Col className='border rounded mx-4 my-2' xs={12} sm={12} md={6} xl={8} xxl={9}>

                            <h6 className='my-4'>Deck: {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </h6>
                            <h6 className='my-4'>Cards:</h6>
                            <ListGroup className='mb-4'>
                                {JSON.parse(localStorage.getItem("decks")) != undefined ? <Decklist fromDecks={true} deck={JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist}></Decklist> : <div />}

                            </ListGroup>
                            <Row className='align-content-center justify-content-center text-center'>
                                {!loading ? <Button className='mt-4 ' variant='outline-primary' style={{ width: "40%" }} onClick={handleShow}>Show decklist</Button> : <div />}
                            </Row>
                            <Row className='align-content-center justify-content-center text-center'>
                                {!loading ? <Button className='mt-4 ' variant='outline-success' style={{ width: "40%" }} onClick={editDeck}>Edit deck</Button> : <div />}
                            </Row>
                            <Row className='align-content-center justify-content-end text-center'>

                                <Button className='my-4 me-4' variant='danger' style={{ width: "7rem" }} onClick={deleteDeck}>Delete deck</Button>
                            </Row>

                        </Col>
                        : <div /> : <div />
                    }
                    <Col xs={0} xl={0} xxl={1} />

                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?
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

                                label={({ dataEntry }) => (dataEntry.title === "Colorless" && hoveredColor == 5) || (dataEntry.title === "White" && hoveredColor == 0) || (dataEntry.title === "Blue" && hoveredColor == 1) || (dataEntry.title === "Black" && hoveredColor == 2) || (dataEntry.title === "Red" && hoveredColor == 3) || (dataEntry.title === "Green" && hoveredColor == 4) ? Math.round(dataEntry.percentage) == 0 ? "" : Math.round(dataEntry.percentage) + '%' : ""}
                                labelPosition={70}
                                labelStyle={{
                                    opacity: 0.75,
                                    pointerEvents: 'none',
                                }}
                                data={[
                                    { title: 'White', value: colors.w, color: '#ffecb8' },
                                    { title: 'Blue', value: colors.u, color: '#4389bf' },
                                    { title: 'Black', value: colors.b, color: '#5b4d78' },
                                    { title: 'Red', value: colors.r, color: '#BD5858' },
                                    { title: 'Green', value: colors.g, color: '#7fc29b' },
                                    { title: 'Colorless', value: colors.c, color: '#C2C2C2' },
                                ]}
                            />
                        </Col>
                        : <div /> : <div />
                    }
                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

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
                                    { title: 'Creature', value: types.c, color: '#b07156' },
                                    { title: 'Land', value: types.l, color: '#3f4b3b' },
                                    { title: 'Instant', value: types.i, color: '#ab4e68' },
                                    { title: 'Sorcery', value: types.s, color: '#afbe8f' },
                                    { title: 'Others', value: types.o, color: '#dde392' },
                                ]}
                            />
                        </Col>
                        : <div /> : <div />
                    }
                    <Col xs={0} xl={0} xxl={1} />

                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?
                        <Row>
                            <Col xs={2} xl={6} xxl={6}></Col>
                            <Col xs={3} xl={2} xxl={2}>
                                <Row className='align-content-center justify-content-center text-end'> <Col xs={6} className='align-content-end justify-content-end me-3'>Land:</Col> <Col xs={4} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#3f4b3b', width: "1rem", height: "1rem" }} /></Col> </Row>
                                <Row className='align-content-center justify-content-center text-end'> <Col xs={6} className='align-content-end justify-content-end me-3'>Creature:</Col> <Col xs={4} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#b07156', width: "1rem", height: "1rem" }} /></Col> </Row>
                                <Row className='align-content-center justify-content-center text-end'> <Col xs={6} className='align-content-end justify-content-end me-3'>Instant:</Col> <Col xs={4} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#ab4e68', width: "1rem", height: "1rem" }} /></Col> </Row>
                            </Col>
                            <Col xs={1} xl={2} xxl={1} />
                            <Col xs={3} xl={2} xxl={2}>
                                <Row className='align-content-center justify-content-center text-end'> <Col xs={6} className='align-content-center justify-content-center me-3'>Sorcery:</Col> <Col xs={4} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#afbe8f', width: "1rem", height: "1rem" }} /></Col> </Row>
                                <Row className='align-content-center justify-content-center text-end'> <Col xs={6} className='align-content-center justify-content-center me-3'>Other:</Col> <Col xs={4} className='align-content-center justify-content-center text-center'><Container className='rounded' style={{ background: '#dde392', width: "1rem", height: "1rem" }} /></Col> </Row>
                            </Col>
                            <Col xs={0} xl={0} xxl={1} />
                        </Row>
                        : <div /> : <div />
                    }
                </Row>
            }

            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Decklist</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <pre>
                        {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ? <div> {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </div> : <div></div> : <div></div>}
                        {currentDeck}
                        <br />
                        <br />
                        {cardNames.map(function (card, i) {
                            console.log()
                            return (
                                <div key={uniqid()}>
                                    {card.name} x {card.amount}
                                </div>
                            )
                        })}
                    </pre>
                </Offcanvas.Body>
            </Offcanvas>

        </div >
    )
}