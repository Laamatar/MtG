import React from 'react';
import { DndContext } from '@dnd-kit/core';
import AllCardsDrop from './allcardsdraggable';
import { Droppable } from './droppable';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Decklist from './decklist';

/**
 * 
 * deckbuilder.jsx
 * 
 * Screen for building a deck.
 * 
 *  
 */

export default function Deckbuilder() {


    //initializing all the needed states

    //name of current deck
    const [deckname, setDeckname] = useState("")
    //alert type
    const [variant, setVariant] = useState("success")
    //alert message
    const [alertmsg, setAlertmsg] = useState("Error!")
    //if alert is shown or not
    const [showA, setShowA] = useState(false);
    //search query for Scryfall API. default search is for cards in english and legal in standard format
    const [APIsearch, setAPIsearch] = useState("search?q=lang=en+legal=standard");
    //cards the API has fetched
    const [cards, setCards] = useState();
    //error state for API fetch and debugging
    const [error, setError] = useState("");
    //default name of the deck. normally "New Deck", but changed to deck name when editing a saved deck
    const [defaultName, setDefaultName] = useState("New Deck");
    //current deck
    const [deck, setDeck] = useState([]);
    //number of cards the API has found
    const [cardsFoundNum, setCardsFound] = useState(0);
    //if site is fetching data from API
    const [loading, setLoading] = useState(false);
    //if filter options are shown
    const [showFilters, setShowFilters] = useState(false);
    //search options that have been chosen in the filter
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


    //function for handling showing card overlay (disabled in deckbuilder)
    function handleShow(e) {
        e.preventDefault();
    }


    //toggle filter options
    function toggleShowFilters() {
        if (showFilters) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }


    //fetch data from Scryfall API
    const getData = async () => {
        setLoading(true);
        //console.log("fetching data...") //debugging
        fetch("https://api.scryfall.com/cards/" + APIsearch)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    //something went wrong

                    setCardsFound(0);
                    setError("No cards found.")

                    //show error alert
                    setVariant("danger")
                    setAlertmsg("No cards found!")
                    setShowA(true)
                    setLoading(false)
                } else {
                    //cards fetched correctly

                    setError("")
                    setCardsFound(result.total_cards)
                    setCards(result)

                    //show success alert
                    setVariant("success")
                    setAlertmsg(result.total_cards + " cards found!")
                    setShowA(true)
                    setLoading(false)
                }
            });
    }

    //useEffect runs once when the page is loaded
    useEffect(() => {
        //fetch cards
        getData();

        //get deck that is to be edited from localStorage
        var d = JSON.parse(localStorage.getItem("decktoedit"));

        //if there is no deck to edit in localStorage, do notheing
        if (d == undefined) {

        } else {
            //check if the name of the dack is not an empty string
            if (d.name != "") {

                //show alert that the deck was loaded
                setVariant("primary")
                setAlertmsg("Loaded deck " + d.name + ".")
                setShowA(true)
                setDefaultName(d.name)

                //set current deck to the loaded deck
                setDeck(d.decklist)

                //set deck to edit to empty deck with empty string name ("")
                localStorage.setItem("decktoedit", JSON.stringify({ name: "", deck: "" }))
            }
        }
    }, []);


    //handles changes in filter options
    function handleChange(e) {
        //hide alert
        setShowA(false)

        //initialize key to changed filter name
        var key = e.target.name;

        //color
        if (key == "white" || key == "blue" || key == "black" || key == "red" || key == "green") {
            var value;
            //set value to boolean based on filter change
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            //set color value in searchData to changed value
            setSearchData({ ...searchData, [key]: value })

            //color exclusivity
        } else if (key == "colorexcl") {
            //do same value change as in colors

            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, exclusivecolors: value })

            //card type
        } else if (key == "typeselect") {
            var value = e.target.value;
            setSearchData({ ...searchData, type: value })

            //search text: do nothing because it is handled elsewhere
        } else if (key == "searchbar") {

            //searching from name/type
        } else if (key == "typesearch") {
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, searchFromTypes: value })

            //format legality
        } else if (key == "standard" || key == "modern" || key == "pauper" || key == "commander" || key == "oathbreaker") {
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, [key]: value })
        }
    }


    //handles applying filters
    function handleSearchSubmit(e) {
        e.preventDefault();

        //hide alert
        setShowA(false)

        //initialize search query options
        var searchquery = "";
        var colors = "";
        var colorsquery = "";
        var type = "";
        var search = "";
        var format = "";

        //colors
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

        //color exclusivity
        if (searchData.exclusivecolors) {
            colorsquery = "colors=" + colors;
        } else {
            colorsquery = "colors>=" + colors;
        }

        //if no colors are chosen, query is empty
        if (!searchData.white && !searchData.blue && !searchData.black && !searchData.red && !searchData.green) {
            colorsquery = "";
        }

        //card type
        if (searchData.type != "Any card type" && searchData.type != "") {
            type = "+t=" + searchData.type;
        }

        //search bar
        //check if searching types or names
        if (searchData.searchFromTypes && searchData.searchTerm != "") {
            search = "+t=" + searchData.searchTerm;
        } else if (searchData.searchTerm != "") {
            search = "+name=" + searchData.searchTerm;
        }


        //format legality
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

        //combine for complete API search query (add requirement of english language and only paper cards, not digital)
        searchquery = "search?q=" + colorsquery + format + type + search + "+lang=english+game=paper";
        setAPIsearch(searchquery);
        //fetch cards from API
        getData();

    }


    //saves deck to localStorage
    function saveDeck(e) {
        //hide alert
        setShowA(false)
        e.preventDefault();

        //initialize deck
        var deckdata = {
            name: deckname,
            decklist: deck
        }

        //get decks from localStorage
        var decksInLS = JSON.parse(localStorage.getItem("decks"))
        if (decksInLS == undefined) {
            decksInLS = []
        }

        //go over localStorage decks
        for (let i = 0; i < decksInLS.length; i++) {
            if (decksInLS[i].name == deckname) {

                //show error alert if deck name is already in saved decks
                setVariant("danger")
                setAlertmsg("Name is already used. Please use another name.")
                setShowA(true)
                return
            }
        }

        //show success alert if name hasn't been used
        setVariant("success")
        setAlertmsg("Deck " + deckname + " saved successfully!")
        setShowA(true)

        //add deck to localStorage
        localStorage.setItem("decks", JSON.stringify([...decksInLS, deckdata]))
    }



    //removes card with given id from deck
    function removeCardByID(id) {

        //initialize new deck
        var newdeck = [];

        //go over all cards in current deck and add them to new deck
        for (let i = 0; i < deck.length; i++) {

            //check if card's id matches with given id
            if (deck[i].id == id) {

                //decrease number of those cards by one
                var newamount = deck[i].amount - 1;

                //if number of cards isn't zero, add the card to new deck
                if (newamount != 0) {
                    newdeck.push({ id: deck[i].id, amount: newamount })
                }

                //if id doesn't match, add the card to new deck
            } else {
                newdeck.push({ id: deck[i].id, amount: deck[i].amount })
            }
        }

        //change current deck
        setDeck(newdeck)
    }


    //adds card with given id to deck
    function addCardByID(id) {

        //boolean of the card is in the current deck
        var indeck = false;
        //initialize new deck
        var newdeck = [];

        //go over all cards in the deck
        for (let i = 0; i < deck.length; i++) {

            //check if given id matches with card's id
            if (deck[i].id == id) {
                //increase number of those cards by one
                var newamount = deck[i].amount + 1;
                //card was in the deck
                indeck = true;
                //add card to new deck
                newdeck.push({ id: deck[i].id, amount: newamount })

                //if ids don't match, add card to deck
            } else {
                newdeck.push({ id: deck[i].id, amount: deck[i].amount })
            }
        }

        //if card wasn't in deck, add it to the deck
        if (!indeck) {
            setDeck([...deck, { id: id, amount: 1 }])

            //otherwise set new deck as current deck
        } else {
            setDeck(newdeck)
        }
    }


    //handles element being dragged to a droppable zone
    function handleDragEnd(event) {

        //check if item is dropped over a droppable area
        if (event.over && event.over.id === 'droppable') {

            //adds card to deck

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

    return (
        //DndContext for drag and drop functionality
        <DndContext onDragEnd={handleDragEnd}>




            {/* if API isn't fetching data, show site contents */}
            {!loading
                ?

                <Row className="px-4 py-4">

                    {/* manual padding div */}
                    <div style={{ height: "8vh" }} />

                    {/* selection of cards to make a deck with */}
                    <Col xs={12} md={6}>

                        {/* show number of cards found or an error message if there was an error with API fetching */}
                        {error == "" ? <h4 className="pt-4">Found {cardsFoundNum} cards {cardsFoundNum >= 180 ? "(Loaded 180 cards)" : "(Loaded " + cardsFoundNum + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}

                        {/* element with all the fetched cards (from allcardsdraggable.jsx) */}
                        <AllCardsDrop handleClick={handleShow} cards={cards} />

                    </Col>

                    {/* deck */}
                    <Col xs={12} md={6}>

                        {/* deck area is a Droppable -element, i.e. draggable elements can be dropped to it */}
                        <Droppable>
                            <Container fluid className='border rounded' style={{ height: "120rem" }}>

                                {/* form for saving a deck and submitting its name */}
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

                                {/* element with deck's cards (from decklist.jsx) */}
                                <Decklist deck={deck} fromDecks={false} removeCard={removeCardByID} addCard={addCardByID}></Decklist>
                            </Container>
                        </Droppable>
                    </Col>
                </Row>
                :
                //if API is still loading, show empty div
                <div />
            }


            {/* filter bar. fixed to top of the site */}
            <div className='d-flex justify-content-center align-content-center mt-2' style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row className='d-flex mt-4 justify-content-center align-content-center' style={{ width: "100%" }}>

                    {/* filter option toggle button */}
                    <Button variant="outline-secondary" onClick={toggleShowFilters} style={{ width: "100%" }} className='mt-4'>{showFilters ? "Hide filter options" : "Show filter options"}</Button>

                    {/* filter options */}
                    {showFilters
                        ?
                        <Form className="px-4 pt-4" onSubmit={handleSearchSubmit} value={searchData} onChange={handleChange}>

                            {/* colors */}
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

                            {/* color exclusivity */}
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

                            {/* card type selection */}
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

                            {/* search bar and search from name/type check */}
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

                            {/* card format legality */}
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

                            {/* apply filters -button */}
                            <Col className="py-4" xs={12} sm={6} md={4} xl={2}>
                                <Button type="submit" variant="primary">Apply filters</Button>
                            </Col>
                        </Form>

                        :
                        <div></div>     //if filter options are hidden, show empty div

                    }
                </Row>
            </div>

            {/* alert */}
            <Alert variant={variant} style={{ position: "fixed", top: "10rem", right: "5rem" }} onClose={() => setShowA(false)} dismissible show={showA}>
                {alertmsg}
            </Alert>

        </DndContext >
    );

}