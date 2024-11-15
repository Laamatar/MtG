import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Offcanvas, ListGroup, Button, Alert } from 'react-bootstrap';
import Decklist from './decklist';
import uniqid from "uniqid"
import { PieChart } from 'react-minimal-pie-chart';
import { useNavigate } from 'react-router-dom';

export default function Decks() {

    //initialize states

    //alert style
    const [variant, setVariant] = useState("success")
    //alert messsage
    const [alertmsg, setAlertmsg] = useState("Error!")
    //if alert is shown
    const [showA, setShowA] = useState(false);
    //segment of deck's colors -pie chart that is hovered over
    const [hoveredColor, setHoveredColor] = useState(undefined);
    //segment of deck's card types -pie chart that is hovered over
    const [hoveredType, setHoveredType] = useState(undefined);
    //colors of cards in currently chosen deck
    const [colors, setColors] = useState({ w: 0, u: 0, b: 0, r: 0, g: 0, c: 0 })
    //types of cards in currently chosen deck
    const [types, setTypes] = useState({ l: 0, c: 0, i: 0, s: 0, o: 0 })
    //names of cards in currently chosen deck
    const [cardNames, setCardNames] = useState([]);
    //index of currently chosen deck in list of decks stored in localStorage
    const [currentDeck, setCurrentDeck] = useState(0)
    //if fetching data from API
    const [loading, setLoading] = useState(true)
    //if offcanvas with decklist in "card name x n" format is shown
    const [show, setShow] = useState(false)

    //used for navigating to different routes
    const navigate = useNavigate();

    //handles closing the offcanvas
    const handleClose = () => setShow(false);

    //useEffect is run once when the page is loaded
    useEffect(() => {

        setLoading(true)
        //sets current deck index to 0
        setCurrentDeck(0)
        setLoading(false)
        //gets data from the API
        fetchData();
    }, []);


    //asynchronous fetch function that gets data of all cards in the deck from the Scryfall API
    async function fetchData() {

        //initialize list of promises
        var promises = [];

        //check if there are decks in the localStorage
        if (JSON.parse(localStorage.getItem("decks")).length != 0) {

            //go over all cards in currently selected deck
            for (let i = 0; i < JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist.length; i++) {

                //add promise to fetch data with that card id
                promises.push(getData(JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist[i].id));
            }
            setLoading(true)

            //execute all promises
            await Promise.all(promises).then(results => {
                console.log(results)
                //initialize deck color and card type counts 
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

                //initialize list of card names and card amounts in the deck
                var cn = [];

                //initialize boolean of if a card is any of the types specified (land, creature, instant, sorcery)
                var hasType = false;

                //go over all cards in the deck
                for (let index = 0; index < results.length; index++) {

                    //increase deck card counts accordingly

                    if (results[index].colors != undefined) {
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
                        }
                    } else {
                        c++;
                    }

                    if (results[index].type_line != undefined) {

                        if (results[index].type_line.includes("Land")) {
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
                    } else {
                        o++;
                    }

                    //add card name and amount to cn
                    cn.push({ name: results[index].name, amount: JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist[index].amount })

                    //reset hasType
                    hasType = false;
                }

                //set colors, types and card name list
                setColors({ w: w, u: u, b: b, r: r, g: g, c: c })
                setTypes({ l: l, c: typec, i: i, s: s, o: o })
                setCardNames(cn)

                //show success alert
                setVariant("success")
                setAlertmsg("Loaded deck " + JSON.parse(localStorage.getItem("decks"))[currentDeck].name)
                setShowA(true)
            }
            ).then(setLoading(false));
        }
    }


    //fetches card data of given card id from the API
    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                } else {
                    return (result)
                }
            });

    }


    //handles changing currently selected deck
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)

        //promise to set deck index and fetch data from API
        var promises = [setCurrentDeck(e.target.elements.decknumber.value), fetchData()]

        //run all promises
        await Promise.all(promises).then(setLoading(false))

    }


    //handles if decklist -offcanvas is shown
    async function handleShow() {
        setShow(true);
    }


    //handles editing a deck
    async function editDeck() {

        //get current deck data
        var d = JSON.parse(localStorage.getItem("decks"))[currentDeck];

        //save that deck to localStorage 
        localStorage.setItem("decktoedit", JSON.stringify(d))

        //open deckbuilder route
        navigate("/deckbuilder")
    }


    //handles deleting a deck
    function deleteDeck() {

        //initialize list of new decks
        var newDecks = [];

        //set alert message before deck name is deleted
        setAlertmsg("Deck " + JSON.parse(localStorage.getItem("decks"))[currentDeck].name + " deleted!")

        //go over all saved decks in localStorage
        for (let index = 0; index < JSON.parse(localStorage.getItem("decks")).length; index++) {

            //if deck is not the deck to be deleted, add it to newDecks list
            if (index != currentDeck) {
                newDecks.push(JSON.parse(localStorage.getItem("decks"))[index])
            }

        }

        //set current deck to first in the storage
        setCurrentDeck(0)

        //if there are decks after deleting one, save new list as decks in localStorage 
        if (newDecks.length != 0) {
            localStorage.setItem("decks", JSON.stringify(newDecks))

        } else {

            //if last deck was deleted, save empty list in localStorage
            localStorage.setItem("decks", JSON.stringify([]))
        }

        //show alert
        setVariant("danger")
        setShowA(true)
    }


    return (
        <div style={{ minHeight: "100vh", width: "100vw" }} className='d-flex mt-4'>

            {/* alert */}
            <Alert variant={variant} style={{ position: "fixed", top: "4rem", right: "4rem" }} onClose={() => setShowA(false)} dismissible show={showA}>
                {alertmsg}
            </Alert>

            {/* if API fetch is done, show screen content */}
            {loading ? <div />
                :
                <Row className='d-flex' style={{ width: "100%" }}>

                    {/* list of decks */}
                    <Col xs={12} sm={12} md={4} xl={3} xxl={2} className='border rounded mx-4 my-2'>
                        <h6 className='my-4'>Decks:</h6>

                        {/* checking if decks is defined and not empty */}
                        {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

                            //map all decks in storage
                            JSON.parse(localStorage.getItem("decks")).map(function (deck, i) {

                                //return hidden form with deck index and a button with the deck's name
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
                            }) : <span /> : <span />}
                    </Col>

                    {/* check if decks exist and is not empty */}
                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0
                        ?

                        //decklist of selected deck
                        <Col className='border rounded mx-4 my-2' xs={12} sm={12} md={6} xl={8} xxl={9}>

                            <h6 className='my-4'>Deck: {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </h6>
                            <h6 className='my-4'>Cards:</h6>

                            {/* map all cards as Decklist -elements (from listitem.jsx) */}
                            <ListGroup className='mb-4'>
                                {JSON.parse(localStorage.getItem("decks")) != undefined ? <Decklist fromDecks={true} deck={JSON.parse(localStorage.getItem("decks"))[currentDeck].decklist}></Decklist> : <div />}
                            </ListGroup>

                            {/* show decklist -button that shows offcanvas with the deck's cards in (cardname x n) format */}
                            <Row className='align-content-center justify-content-center text-center'>
                                {!loading ? <Button className='mt-4 ' variant='outline-primary' style={{ width: "40%" }} onClick={handleShow}>Show decklist</Button> : <div />}
                            </Row>

                            {/* edit deck -button */}
                            <Row className='align-content-center justify-content-center text-center'>
                                {!loading ? <Button className='mt-4 ' variant='outline-success' style={{ width: "40%" }} onClick={editDeck}>Edit deck</Button> : <div />}
                            </Row>

                            {/* delete deck -button */}
                            <Row className='align-content-center justify-content-end text-center'>
                                <Button className='mt-4 mb-2 me-4' variant='danger' style={{ width: "7rem" }} onClick={deleteDeck}>Delete deck</Button>
                            </Row>
                        </Col>
                        : <div /> : <div />
                    }


                    <Col xs={0} xl={0} xxl={1} />

                    {/* again check decks -list */}
                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

                        // color pie chart
                        <Col xs={12} xl={6} xxl={5} className='mt-1 px-4 align-content-center justify-content-center text-center'>
                            <PieChart

                                //element style
                                style={{
                                    width: "30rem", fontFamily:
                                        '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                    fontSize: '8px'
                                }}

                                //radius of chart compared to the object size
                                radius={40}

                                //on hover, set segment index to hoveredColor
                                onMouseOver={(_, index) => {
                                    setHoveredColor(index);
                                }}

                                //when no longer hovering, reset hoveredColor
                                onMouseOut={() => {
                                    setHoveredColor(undefined);
                                }}

                                //show percent label when hovering on segment
                                label={({ dataEntry }) => (dataEntry.title === "Colorless" && hoveredColor == 5) || (dataEntry.title === "White" && hoveredColor == 0) || (dataEntry.title === "Blue" && hoveredColor == 1) || (dataEntry.title === "Black" && hoveredColor == 2) || (dataEntry.title === "Red" && hoveredColor == 3) || (dataEntry.title === "Green" && hoveredColor == 4) ? Math.round(dataEntry.percentage) == 0 ? "" : Math.round(dataEntry.percentage) + '%' : ""}
                                labelPosition={70}
                                labelStyle={{
                                    opacity: 0.75,
                                    pointerEvents: 'none',
                                }}

                                //chart data
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

                    {/* yet again check decks -list */}
                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

                        // card types pie chart
                        <Col xs={12} xl={6} xxl={5} className='mt-1 px-4 align-content-center justify-content-center text-center'>
                            <PieChart

                                //element style
                                style={{
                                    width: "30rem", fontFamily:
                                        '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
                                    fontSize: '8px'
                                }}

                                //radius of chart compared to the object size
                                radius={40}

                                //on hover, set segment index to hoveredType
                                onMouseOver={(_, index) => {
                                    setHoveredType(index);
                                }}

                                //when no longer hovering, reset hoveredColor
                                onMouseOut={() => {
                                    setHoveredType(undefined);
                                }}

                                //show percent label when hovering on segment
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

                    {/* check decks */}
                    {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ?

                        //card type -piechart category labels 
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

            {/* decklist offcanvas */}
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Decklist</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <pre>
                        {JSON.parse(localStorage.getItem("decks")) != undefined ? JSON.parse(localStorage.getItem("decks")).length != 0 ? <div> {JSON.parse(localStorage.getItem("decks"))[currentDeck].name} </div> : <div></div> : <div></div>}
                        <br />
                        {cardNames.map(function (card, i) {
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