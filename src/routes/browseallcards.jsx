import AllCards from "./allcards"
import { Row, Col, Button, Form, Offcanvas, ListGroup, Alert } from "react-bootstrap"
import { useState, useEffect } from "react";

/**
 * 
 * browseallcards.jsx
 * 
 * Screen for looking at cards, filtering them and adding them to collection and/or wishlist
 *
 * 
 */


export default function BrowseAllCards() {

    //initializing all the needed states

    //alert style
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
    //if card information offcanvas is shown or not
    const [show, setShow] = useState(false);
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
    //currently selected card that is shown in the offcanvas
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


    //handles closing the offcanvas
    const handleClose = () => setShow(false);

    //handles clicking on a card and showing the offcanvas
    function handleShow(e) {
        e.preventDefault();

        // initialize variables
        var name;
        var oracle;
        var price;
        var gathererlink;
        var edhrec;
        var tgcplayer;
        var scryfall;
        var img;
        var types;
        var id;


        //try to get card info, use defaults if failed (e.g. card is undefined)

        try {
            name = e.target.elements.name.value;
        } catch (error) {
            name = "Card name"
        }


        if (e.target.elements.oracle.value != undefined) {
            oracle = e.target.elements.oracle.value;
        } else {
            oracle = "Card text";
        }
        if (e.target.elements.price.value != undefined) {
            price = e.target.elements.price.value;
        } else {
            price = "Card price";
        }
        try {
            gathererlink = e.target.elements.gathererlink.value;
        } catch (error) {
            gathererlink = "Card gatherer link";
        }
        try {
            edhrec = e.target.elements.edhrec.value;
        } catch (error) {
            edhrec = "Card edhrec link";
        }
        try {
            tgcplayer = e.target.elements.tgcplayer.value;
        } catch (error) {
            tgcplayer = "Card tgcplayer link";
        }
        try {
            scryfall = e.target.elements.scryfall.value;
        } catch (error) {
            scryfall = "Card scryfall link";
        }
        try {
            img = e.target.elements.imgsrc.value;
        } catch (error) {
            img = "Card img";
        }
        try {
            types = e.target.elements.typeline.value;
        } catch (error) {
            types = "Card types";
        }
        try {
            id = e.target.elements.id.value;
        } catch (error) {
            id = "Card id";
        }


        //make an object with the card values
        var cardinfo = {
            name: name,
            oracle: oracle,
            price: price,
            gatherer: gathererlink,
            edhrec: edhrec,
            tgcplayer: tgcplayer,
            scryfall: scryfall,
            img: img,
            types: types,
            id: id

        };

        //set selected card
        setSelectedCard(cardinfo);

        //set selected card
        setShow(true);
    }

    //toggles filter options
    function toggleShowFilters() {
        if (showFilters) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }


    //saves given object to localStorage
    function addToLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value))

    }


    //adds a card to collection and saves it to localStorage 
    async function addToCollection(e) {
        e.preventDefault();

        //get durrent collection
        var col = JSON.parse(localStorage.getItem("collection"))

        //get id of card to be added
        var id = e.target.elements.idOfSelectedCardC.value;

        //if collection from localStorage is not defined, set is as an empty list
        if (col == undefined) {
            col = []
        }

        //if collection has cards, but doesn't have the given card, add card to collection and save it 
        if (col.length != 0) {
            if (!col.includes(id)) {
                col.push(id)
                addToLocalStorage("collection", col)
            }

            //if collection doesn't have cards, add card to collection and save it
        } else {
            col.push(id)
            addToLocalStorage("collection", col)
        }

        //show success alert
        setVariant("success")
        setAlertmsg("Card added to collection!")
        setShowA(true)
    }


    //adds a card to wishlist and saves it to localStorage 
    async function addToWishlist(e) {
        e.preventDefault();

        //get durrent wishlist
        var wl = JSON.parse(localStorage.getItem("wishlist"))

        //get id of card to be added
        var id = e.target.elements.idOfSelectedCardWL.value;

        //if wishlist from localStorage is not defined, set is as an empty list
        if (wl == undefined) {
            wl = []
        }

        //if wishlist has cards, but doesn't have the given card, add card to wishlist and save it 
        if (wl.length != 0) {
            if (!wl.includes(id)) {
                wl.push(id)
                addToLocalStorage("wishlist", wl)
            }

            //if wishlist doesn't have cards, add card to wishlist and save it
        } else {
            wl.push(id)
            addToLocalStorage("wishlist", wl)
        }

        //show success alert
        setVariant("success")
        setAlertmsg("Card added to wishlist!")
        setShowA(true)

    }


    //fetch data from Scryfall API
    const getData = async () => {
        setLoading(true);
        fetch("https://api.scryfall.com/cards/" + APIsearch)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    //something went wrong

                    //show error alert
                    setVariant("danger")
                    setAlertmsg("No cards found!")
                    setShowA(true)

                    //set number of fetched cards to 0
                    setCardsFound(0);

                    //set error
                    setError("No cards found.")
                    setLoading(false)
                } else {
                    //cards found
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


    //useEffect is run when APIsearch is changed
    useEffect(() => {

        //fetches cards from the API
        getData();

    }, [APIsearch]);



    //handles changes to filter options
    function handleChange(e) {
        //hide alert
        setShowA(false)

        //initialize key to filter option
        var key = e.target.name;

        //color
        if (key == "white" || key == "blue" || key == "black" || key == "red" || key == "green") {
            var value;
            if (e.target.value == "true") {
                value = false;
            } else if (e.target.value == "false") {
                value = true;
            }
            setSearchData({ ...searchData, [key]: value })

            //color exclusivity
        } else if (key == "colorexcl") {
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

            //search (is handled elsewhere)
        } else if (key == "searchbar") {

            //search (searching from types)
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

        //search (from name/types)
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

        //combine search query (and add language: english and paper cards (not digital))
        searchquery = "search?q=" + colorsquery + format + type + search + "+lang=english+game=paper";
        setAPIsearch(searchquery);

    }



    return (
        <div className="d-flex">

            {/* offcanvas that shows card name, image, types, text, price, links and buttons to add to collection or wishlist */}
            <Offcanvas show={show} onHide={handleClose} placement="end">

                {/* card name */}
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{selectedCard.name}</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>

                    {/* card image */}
                    <img src={selectedCard.img} width={"100%"} className="my-4"></img>

                    {/* card types */}
                    <h4>{selectedCard.types}</h4>

                    {/* card text. adds a space after a period */}
                    {selectedCard.oracle.split(".").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item + ". "}
                            </span>
                        )
                    })
                    }

                    {/* card price */}
                    <h5 className="py-4">Price {selectedCard.price}€</h5>

                    {/* links */}
                    <ListGroup>
                        <ListGroup.Item><a href={selectedCard.scryfall} target="_blank">Scryfall</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.gatherer} target="_blank">Gatherer</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.edhrec} target="_blank">EDHrec</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.tgcplayer} target="_blank">TGCPlayer</a></ListGroup.Item>
                    </ListGroup>

                    {/* add to collection add to wishlist */}
                    <Row className="d-flex pt-4">

                        {/* hidden form with card id */}
                        <Form onSubmit={addToCollection}>
                            <Form.Control type="text" defaultValue={selectedCard.id} id="idOfSelectedCardC" className="d-none" />

                            {/* button */}
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="primary" type="submit" style={{ width: "90%" }}>Add to collection</Button>
                            </Col>
                        </Form>

                        {/* another hidden form */}
                        <Form onSubmit={addToWishlist}>
                            <Form.Control type="text" defaultValue={selectedCard.id} id="idOfSelectedCardWL" className="d-none" />

                            {/* button */}
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="secondary" type="submit" style={{ width: "90%" }}>Add to wishlist</Button>
                            </Col>
                        </Form>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>


            {/* filter options. bar is fixed to top of the page */}
            <div className='d-flex justify-content-center align-content-center mt-2' style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row className='d-flex mt-4 justify-content-center align-content-center' style={{ width: "100%" }}>

                    {/* toggle showing filter options */}
                    <Button variant="outline-secondary" onClick={toggleShowFilters} style={{ width: "100%" }} className='mt-4'>{showFilters ? "Hide filter options" : "Show filter options"}</Button>

                    {/* filter options */}
                    {showFilters
                        ?
                        <Form className="ps-4" onSubmit={handleSearchSubmit} value={searchData} onChange={handleChange}>

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

                            {/* card type */}
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

                            {/* search bar */}
                            <Col xs={12} sm={8} md={6} xl={4} xxl={3} className="py-2">

                                <Form.Label htmlFor="search">Search by name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="search"
                                    name="searchbar"
                                    value={searchData.searchTerm}
                                    onChange={e => setSearchData({ ...searchData, searchTerm: e.target.value })}

                                />

                                {/* toggle to search from name/types */}
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

                            {/* format legality */}
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
                        <div></div> //show empty div if filter options are hidden

                    }
                </Row>

                {/* alert */}
                <Alert variant={variant} style={{ position: "fixed", top: "10rem" }} onClose={() => setShowA(false)} dismissible show={showA}>
                    {alertmsg}
                </Alert>
            </div>

            {/* card selection. hidden if fetching data from API */}
            {!loading
                ?
                <Row className="px-4 py-4">

                    {/* manual padding div */}
                    <div style={{ height: "5vh" }} />

                    {/* number of cards fetched. shows no cards found if an error occurred */}
                    {error == "" ? <h4 className="pt-4">Found {cardsFoundNum} cards {cardsFoundNum >= 180 ? "(Loaded 180 cards)" : "(Loaded " + cardsFoundNum + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}

                    {/* cards from allcards.jsx */}
                    <AllCards handleClick={handleShow} cards={cards} />
                </Row>
                :
                <div />
            }

        </div>
    )
}