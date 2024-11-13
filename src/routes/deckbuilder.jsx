import React from 'react';
import { DndContext } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import AllCardsDrop from './allcardsdraggable';
import { Draggable } from './draggable';
import { Droppable } from './droppable';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Offcanvas, ListGroup, Button, OverlayTrigger, Popover, ListGroupItem, FormControl } from 'react-bootstrap';
import Decklist from './decklist';

export default function Deckbuilder() {


    const [show, setShow] = useState(false);
    const [deck, setDeck] = useState([]);
    const [cardsFoundNum, setCardsFound] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchData, setSearchData] = useState(
        {
            white: false,
            blue: false,
            black: false,
            red: false,
            green: false,
            exclusivecolors: false,
            type: "",
            searchTerm: "",
            searchFromTypes: false,
            standard: false,
            modern: false,
            pauper: false,
            commander: false,
            oathbreaker: false
        }
    );
    const [selectedCard, setSelectedCard] = useState({
        name: "Card name",
        oracle: "Card text",
        price: "0€",
        gatherer: "",
        edhrec: "",
        tgcplayer: "",
        scryfall: "",
        img: "",
        types: "",
        id: ""

    })

    const [APIsearch, setAPIsearch] = useState("search?q=lang=en+legal=standard");
    const [cards, setCards] = useState();
    const [error, setError] = useState("");
    const [defaultName, setDefaultName] = useState("New Deck");

    const handleClose = () => setShow(false);

    function handleShow(e) {
        e.preventDefault();


    }

    function toggleShowFilters() {
        if (showFilters) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }

    function addToLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
        console.log(JSON.parse(localStorage.getItem(name)))
        console.log("add to local storage : " + name)

    }



    const getData = async () => {
        setLoading(true);
        console.log("fetching data...")
        fetch("https://api.scryfall.com/cards/" + APIsearch)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    console.log(result.code)
                    console.log(result.details)
                    setCardsFound(0);
                    setError("No cards found.")
                    setLoading(false)
                } else {
                    setError("")
                    console.log(result)
                    setCardsFound(result.total_cards)
                    setCards(result)
                    setLoading(false)
                }
            });
    }

    useEffect(() => {
        getData();
        var d = JSON.parse(localStorage.getItem("decktoedit")) ;
        console.log(d.name)


            if (d.name != "") {
                setDefaultName(d.name)
                setDeck(d.decklist)
                localStorage.setItem("decktoedit", JSON.stringify({name: "", deck: ""}))
            }
        


    }, []);


    function handleChange(e) {
        var key = e.target.name;
        if (key == "white" || key == "blue" || key == "black" || key == "red" || key == "green") {
            console.log("toggle color: " + e.target.name)
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, [key]: value })
        } else if (key == "colorexcl") {
            console.log("toggle color exclusivity")
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, exclusivecolors: value })
        } else if (key == "typeselect") {
            console.log("change type to " + e.target.value)
            var value = e.target.value;
            setSearchData({ ...searchData, type: value })
        } else if (key == "searchbar") {
        } else if (key == "typesearch") {
            console.log("toggle searching from types")
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, searchFromTypes: value })
        } else if (key == "standard" || key == "modern" || key == "pauper" || key == "commander" || key == "oathbreaker") {
            console.log("toggle format: " + e.target.name)
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, [key]: value })
        }
    }


    function handleSearchSubmit(e) {
        e.preventDefault();
        console.log("filter applied!");
        console.log(searchData);
        var searchquery = "";
        var colors = "";
        var colorsquery = "";
        var type = "";
        var search = "";
        var format = "";
        if (searchData.white) {
            colors = colors + "w";
        }
        if (searchData.blue) {
            colors = colors + "u";
        }
        if (searchData.black) {
            colors = colors + "b";
        }
        if (searchData.red) {
            colors = colors + "r";
        }
        if (searchData.green) {
            colors = colors + "g";
        }
        if (searchData.exclusivecolors) {
            colorsquery = "colors=" + colors;
        } else {
            colorsquery = "colors>=" + colors;
        }

        if (!searchData.white && !searchData.blue && !searchData.black && !searchData.red && !searchData.green) {
            colorsquery = "";
        }

        if (searchData.type != "Any card type" && searchData.type != "") {
            type = "+t=" + searchData.type;
        }
        if (searchData.searchFromTypes && searchData.searchTerm != "") {
            search = "+t=" + searchData.searchTerm;
        } else if (searchData.searchTerm != "") {
            search = "+name=" + searchData.searchTerm;
        }
        if (searchData.standard) {
            format = format + "+legal=standard";
        }
        if (searchData.modern) {
            format = format + "+legal=modern";
        }
        if (searchData.pauper) {
            format = format + "+legal=pauper";
        }
        if (searchData.commander) {
            format = format + "+legal=commander";
        }
        if (searchData.oathbreaker) {
            format = format + "+legal=oathbreaker";
        }
        searchquery = "search?q=" + colorsquery + format + type + search + "+lang=english+game=paper";
        console.log(searchquery);
        setAPIsearch(searchquery);
        getData();

    }

    function saveDeck(e) {
        e.preventDefault();
        console.log(deckname)
        var deckdata = {
            name: deckname,
            decklist: deck
        }
        var decksInLS = JSON.parse(localStorage.getItem("decks"))
        if (decksInLS == undefined) {
            decksInLS = []
        }
        for (let i = 0; i < decksInLS.length; i++) {
            if (decksInLS[i].name == deckname) {
                console.log("alert, name already in use")
                console.log("message box, use " + deckname + " (copy) instead, y/n")
                return
            }
        }

        localStorage.setItem("decks", JSON.stringify([...decksInLS, deckdata]))
    }

    const [deckname, setDeckname] = useState("")


    function removeCardByID(id) {
        console.log(id)

        var newdeck = [];
        for (let i = 0; i < deck.length; i++) {
            if (deck[i].id == id) {
                var newamount = deck[i].amount - 1;

                if (newamount != 0) {
                    newdeck.push({ id: deck[i].id, amount: newamount })
                }

            } else {
                newdeck.push({ id: deck[i].id, amount: deck[i].amount })
            }
        }
        setDeck(newdeck)
    }

    function addCardByID(id) {
        console.log("added card (" + id + ") to deck")
        var indeck = false;
        var newdeck = [];
        for (let i = 0; i < deck.length; i++) {
            if (deck[i].id == id) {
                var newamount = deck[i].amount + 1;
                indeck = true;
                console.log("already in deck")
                newdeck.push({ id: deck[i].id, amount: newamount })

            } else {
                newdeck.push({ id: deck[i].id, amount: deck[i].amount })
            }
        }

        if (!indeck) {
            setDeck([...deck, { id: id, amount: 1 }])
            console.log("added to deck")
        } else {
            setDeck(newdeck)
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>





            {!loading
                ?

                <Row className="px-4 py-4">
                    <div style={{ height: "8vh" }} />
                    <Col xs={12} md={6}>

                        {error == "" ? <h4 className="pt-4">Found {cardsFoundNum} cards {cardsFoundNum >= 180 ? "(Loaded 180 cards)" : "(Loaded " + cardsFoundNum + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}
                        <AllCardsDrop handleClick={handleShow} cards={cards} />
                    </Col>
                    <Col xs={12} md={6}>

                        <Droppable>

                            <Container fluid className='border rounded' style={{ height: "120rem" }}>

                                <Form className='py-2 ps-1' onSubmit={saveDeck}>
                                    <Row>
                                        <Col>
                                            <Form.Control
                                                type="text"
                                                id="deckname"
                                                name="deckname"
                                                placeholder={defaultName}
                                                value={deckname}
                                                onChange={e => setDeckname(e.target.value)}

                                            />
                                        </Col>
                                        <Col>
                                            <Button variant='outline-success' type='submit'>Save deck</Button>
                                        </Col>
                                    </Row>
                                </Form>
                                <Decklist deck={deck} fromDecks={false} removeCard={removeCardByID} addCard={addCardByID}></Decklist>
                            </Container>
                        </Droppable>
                    </Col>
                </Row>
                :
                <div />
            }



            <div className='d-flex justify-content-center align-content-center mt-2' style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row className='d-flex mt-4 justify-content-center align-content-center' style={{ width: "100%" }}>
                    <Button variant="outline-secondary" onClick={toggleShowFilters} style={{ width: "100%" }} className='mt-4'>{showFilters ? "Hide filter options" : "Show filter options"}</Button>
                    {showFilters
                        ?
                        <Form className="px-4 pt-4" onSubmit={handleSearchSubmit} value={searchData} onChange={handleChange}>
                            <Col xs={12} className="pt-2">
                                <Form.Check
                                    inline
                                    label="White"
                                    name="white"
                                    type="checkbox"
                                    value={searchData.white}
                                    defaultChecked={searchData.white}
                                    id={`inline-select-w`}
                                />
                                <Form.Check
                                    inline
                                    label="Blue"
                                    name="blue"
                                    type="checkbox"
                                    value={searchData.blue}
                                    defaultChecked={searchData.blue}
                                    id={`inline-select-u`}
                                />
                                <Form.Check
                                    inline
                                    label="Black"
                                    name="black"
                                    type="checkbox"
                                    value={searchData.black}
                                    defaultChecked={searchData.black}
                                    id={`inline-select-b`}
                                />
                                <Form.Check
                                    inline
                                    label="Red"
                                    name="red"
                                    type="checkbox"
                                    value={searchData.red}
                                    defaultChecked={searchData.red}
                                    id={`inline-select-r`}
                                />
                                <Form.Check
                                    inline
                                    label="Green"
                                    name="green"
                                    type="checkbox"
                                    value={searchData.green}
                                    defaultChecked={searchData.green}
                                    id={`inline-select-g`}
                                />
                            </Col>
                            <Col>
                                <Form.Check
                                    label="Only these colors"
                                    name="colorexcl"
                                    value={searchData.exclusivecolors}
                                    defaultChecked={searchData.exclusivecolors}
                                    type="checkbox"
                                    id={`inline-select-exlusivecolor`}
                                />
                            </Col>

                            <Col className="pt-2" xs={12} sm={6} md={4} xl={2}>
                                <Form.Select aria-label="Default select example" name="typeselect" defaultValue={searchData.type}>
                                    <option>Any card type</option>
                                    <option value="artifact">Artifact</option>
                                    <option value="enchantment">Enchantment</option>
                                    <option value="creature">Creature</option>
                                    <option value="instant">Instant</option>
                                    <option value="land">Land</option>
                                    <option value="legendary">Legendary</option>
                                    <option value="planeswalker">Planeswalker</option>
                                    <option value="sorcery">Sorcery</option>
                                </Form.Select>
                            </Col>

                            <Col xs={12} sm={8} md={6} xl={4} xxl={3} className="py-2">

                                <Form.Label htmlFor="search">Search by name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="search"
                                    name="searchbar"
                                    value={searchData.searchTerm}
                                    onChange={e => setSearchData({ ...searchData, searchTerm: e.target.value })}

                                />
                                <Form.Check
                                    inline
                                    label="Search from types instead"
                                    type="checkbox"
                                    name="typesearch"
                                    value={searchData.searchFromTypes}
                                    defaultChecked={searchData.searchFromTypes}
                                    id={`inline-select-searchtype`}
                                />
                            </Col>
                            <Col>
                                <p>Legal in formats:</p>
                                <Form.Check
                                    inline
                                    label="Standard"
                                    name="standard"
                                    type="checkbox"
                                    value={searchData.standard}
                                    defaultChecked={searchData.standard}
                                    id={`inline-select-standard`}
                                />
                                <Form.Check
                                    inline
                                    label="Modern"
                                    name="modern"
                                    type="checkbox"
                                    value={searchData.modern}
                                    defaultChecked={searchData.modern}
                                    id={`inline-select-modern`}
                                />
                                <Form.Check
                                    inline
                                    label="Pauper"
                                    name="pauper"
                                    type="checkbox"
                                    value={searchData.pauper}
                                    defaultChecked={searchData.pauper}
                                    id={`inline-select-pauper`}
                                />
                                <Form.Check
                                    inline
                                    label="Commander"
                                    name="commander"
                                    type="checkbox"
                                    value={searchData.commander}
                                    defaultChecked={searchData.commander}
                                    id={`inline-select-commander`}
                                />
                                <Form.Check
                                    inline
                                    label="Oathbreaker"
                                    name="oathbreaker"
                                    type="checkbox"
                                    value={searchData.oathbreaker}
                                    defaultChecked={searchData.oathbreaker}
                                    id={`inline-select-oathbreaker`}
                                />
                            </Col>
                            <Col className="py-4" xs={12} sm={6} md={4} xl={2}>
                                <Button type="submit" variant="primary">Apply filters</Button>
                            </Col>
                        </Form>

                        :
                        <div></div>

                    }
                </Row>
            </div>

        </DndContext >
    );

    function handleDragEnd(event) {
        console.log(deck)
        if (event.over && event.over.id === 'droppable') {
            console.log("added card (" + event.active.id + ") to deck")
            var indeck = false;
            var newdeck = [];
            for (let i = 0; i < deck.length; i++) {
                if (deck[i].id == event.active.id) {
                    var newamount = deck[i].amount + 1;
                    indeck = true;
                    console.log("already in deck")
                    newdeck.push({ id: deck[i].id, amount: newamount })

                } else {
                    newdeck.push({ id: deck[i].id, amount: deck[i].amount })
                }
            }

            if (!indeck) {
                setDeck([...deck, { id: event.active.id, amount: 1 }])
                console.log("added to deck")
            } else {
                setDeck(newdeck)
            }

        }
    }
}