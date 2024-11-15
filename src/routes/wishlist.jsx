import SomeCards from "./specificcards"
import { Row, Col, Button, Form, Offcanvas, ListGroup, Container, Alert } from "react-bootstrap"
import { useState, useEffect } from "react";

/**
 * 
 * wishlist.jsx 
 * 
 * Screen for looking and removing cards in wishlist.
 * 
 */

export default function Wishlist() {

    //initializing all the needed states

    //alert style
    const [variant, setVariant] = useState("success")
    //alert message
    const [alertmsg, setAlertmsg] = useState("Error!")
    //if alert is shown
    const [showA, setShowA] = useState(false);
    //cards fetched by the API
    const [cards, setCards] = useState([]);
    //cards that have been filtered by filter options (cards that are shown)
    const [filteredCards, setFilteredCards] = useState([]);
    //if card information offcanvas is shown
    const [show, setShow] = useState(false);
    //error state
    const [error, setError] = useState("")
    //if fetching from API is in progress
    const [loading, setLoading] = useState(false);
    //if filter options are shown
    const [showFilters, setShowFilters] = useState(false);
    //search options that have been chosen in the filter
    const [searchData, setSearchData] = useState(
        {
            white: true,
            blue: true,
            black: true,
            red: true,
            green: true,
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

        //show the offcanvas
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

    //useEffect is run once when the page is loaded
    useEffect(() => {

        //fetch card data from the API
        fetchData(true)

        //show all cards, i.e. set all cards as filtered cards
        setFilteredCards(cards)

    }, []);


    //refreshes the shown cards
    function refreshData() {

        //show all cards, i.e. set all cards as filtered cards
        setFilteredCards(cards)

        //show success alert
        setVariant("success")
        setAlertmsg("Refreshed cards!")
        setShowA(true)
    }



    //asynchronous function that fetches all cards of the collection from the API 
    async function fetchData() {

        //initialize empty list of promises
        var promises = [];

        //check if collection is defined
        if (JSON.parse(localStorage.getItem("wishlist")) != undefined) {

            //go over all cards in the collection
            for (let i = 0; i < JSON.parse(localStorage.getItem("wishlist")).length; i++) {

                //add promise to get card data to the promises
                promises.push(getData(JSON.parse(localStorage.getItem("wishlist"))[i]));
            }
            setLoading(true)

            //wait for all promises to complete and then set all cards
            await Promise.all(promises).then(results => setCards(results)).then(
                setLoading(false)
            );
        }
    }

    //fetches card data of a given id from the API
    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    //something went wrong

                    //show error alert
                    setVariant("danger")
                    setAlertmsg("No cards found!")
                    setShowA(true)

                    //set error state
                    setError("No cards found.")
                } else {
                    //cards found

                    //reset error state
                    setError("");

                    //show success alert
                    setVariant("success")
                    setAlertmsg("Loaded cards!")
                    setShowA(true)

                    //return card data
                    return (result)
                }
            });

    }




    //handles filter option changes
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

            //card type
        } else if (key == "typeselect") {
            var value = e.target.value;
            setSearchData({ ...searchData, type: value })

            //search (handled elsewhere)
        } else if (key == "searchbar") {

            //search (from types)
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

        //initialize temp variables
        var colorfiltered = []
        var filtered = []

        //go over all cards 
        for (let i = 0; i < cards.length; i++) {

            //colors: adds card to colorfiltered if matches with at least one filter color

            if (searchData.white) {
                if (cards[i].colors.includes("W")) {
                    colorfiltered.push(cards[i])
                }
            }

            if (cards[i].colors.length == 0) {
                colorfiltered.push(cards[i])
            }

            if (searchData.blue) {
                if (cards[i].colors.includes("U")) {
                    if (!colorfiltered.includes(cards[i])) {
                        colorfiltered.push(cards[i])
                    }
                }
            } if (searchData.black) {

                if (cards[i].colors.includes("B")) {
                    if (!colorfiltered.includes(cards[i])) {
                        colorfiltered.push(cards[i])
                    }
                }
            } if (searchData.red) {

                if (cards[i].colors.includes("R")) {
                    if (!colorfiltered.includes(cards[i])) {
                        colorfiltered.push(cards[i])
                    }
                }
            } if (searchData.green) {

                if (cards[i].colors.includes("G")) {
                    if (!colorfiltered.includes(cards[i])) {
                        colorfiltered.push(cards[i])
                    }
                }
            }
        }


        //initialize new list
        var typefiltered = []

        //go over all cards that passed color filtering
        for (let i = 0; i < colorfiltered.length; i++) {

            //types: adds card to typefiltered if matches with at least one filter type

            if (searchData.type != "Any card type" && searchData.type != "") {
                if (colorfiltered[i].type_line.includes(searchData.type)) {
                    typefiltered.push(colorfiltered[i])
                }
            } else if (searchData.type == "Any card type" || searchData.type == "") {
                if (!searchData.searchFromTypes) {
                    typefiltered.push(colorfiltered[i])
                }
            }

            if (searchData.searchFromTypes && searchData.searchTerm != "") {
                if (colorfiltered[i].type_line.toLowerCase().includes(searchData.searchTerm.toLowerCase()) && !typefiltered.includes(colorfiltered[i])) {
                    typefiltered.push(colorfiltered[i])
                }
            }

        }

        //initialize new list
        var searchfiltered = []

        //go over all cards that passed type filtering
        for (let i = 0; i < typefiltered.length; i++) {

            //search: adds card to searchfiltered if matches with search term

            if (searchData.searchTerm != "") {
                if (typefiltered[i].name.toLowerCase().includes(searchData.searchTerm.toLowerCase())) {
                    searchfiltered.push(typefiltered[i])
                }
            } else {
                searchfiltered.push(typefiltered[i])

            }
        }

        //initialize new list
        var formatfiltered = []

        //go over all cards that passed search filtering
        for (let i = 0; i < typefiltered.length; i++) {

            //formats: adds card to formatfiltered if matches with at least one filter format legality

            if (searchData.standard) {
                if (searchfiltered[i].legalities.standard == "legal") {
                    formatfiltered.push(searchfiltered[i])
                }
            }
            if (searchData.modern) {
                if (searchfiltered[i].legalities.modern == "legal") {
                    if (!formatfiltered.includes(searchfiltered[i])) {
                        formatfiltered.push(searchfiltered[i])
                    }
                }
            }
            if (searchData.pauper) {
                if (searchfiltered[i].legalities.pauper == "legal") {
                    if (!formatfiltered.includes(searchfiltered[i])) {
                        formatfiltered.push(searchfiltered[i])
                    }
                }
            }
            if (searchData.commander) {
                if (searchfiltered[i].legalities.commander == "legal") {
                    if (!formatfiltered.includes(searchfiltered[i])) {
                        formatfiltered.push(searchfiltered[i])
                    }
                }
            }
            if (searchData.oathbreaker) {
                if (searchfiltered[i].legalities.oathbreaker == "legal") {
                    if (!formatfiltered.includes(searchfiltered[i])) {
                        formatfiltered.push(searchfiltered[i])
                    }
                }
            }
            if (!searchData.standard && !searchData.modern && !searchData.pauper && !searchData.commander && !searchData.oathbreaker) {
                formatfiltered.push(searchfiltered[i])

            }
        }

        //filtered cards are now cards that passed all filters
        filtered = formatfiltered;

        //set filtered cards
        setFilteredCards(filtered);
    }


    //saves given object to localStorage
    function addToLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
        fetchData()

    }

    //handles removing a card from wishlist
    function removeFromWishlist(e) {
        e.preventDefault();

        //get wishlist from localStorage
        var wl = JSON.parse(localStorage.getItem("wishlist"))

        //get id of card to be removed
        var id = e.target.elements.idselected.value;

        //if wishlist includes the card, splice the id out of the wishlist list 
        if (wl.includes(id)) {
            wl.splice(wl.indexOf(id), 1);

            //update the wishlist
            addToLocalStorage("wishlist", wl)

            //refresh the cards
            refreshData()
        }

        //show alert
        setVariant("danger")
        setAlertmsg("Removed card from wishlist!")
        setShowA(true)
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

                    {/* card text (adds a space after a period) */}
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

                    {/* remove from wishlist -button with hidden form */}
                    <Form onSubmit={removeFromWishlist}>
                        <Form.Control type="text" defaultValue={selectedCard.id} id="idselected" className="d-none" />
                        <Container className="d-flex align-items-center justify-content-center mt-4">
                            <Button variant="danger" type="submit">Remove from wishlist</Button>
                        </Container>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* filter options. fixed to the top of the page */}
            <div className='d-flex justify-content-center align-content-center mt-2' style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row className='d-flex mt-4 justify-content-center align-content-center' style={{ width: "100%" }}>

                    {/* button for refreshing the cards */}
                    <Container className="ps-4">
                        <Button variant="secondary" onClick={refreshData} style={{ width: "15rem" }}>Reset filters and refresh cards</Button>
                    </Container>

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

                            {/* card type */}
                            <Col className="pt-2" xs={12} sm={6} md={4} xl={2}>
                                <Form.Select aria-label="Default select example" name="typeselect" defaultValue={searchData.type}>
                                    <option>Any card type</option>
                                    <option value="Artifact">Artifact</option>
                                    <option value="Enchantment">Enchantment</option>
                                    <option value="Creature">Creature</option>
                                    <option value="Instant">Instant</option>
                                    <option value="Land">Land</option>
                                    <option value="Legendary">Legendary</option>
                                    <option value="Planeswalker">Planeswalker</option>
                                    <option value="Sorcery">Sorcery</option>
                                </Form.Select>
                            </Col>

                            {/* search */}
                            <Col xs={12} sm={8} md={6} xl={4} xxl={3} className="py-2">

                                <Form.Label htmlFor="search">Search by name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="search"
                                    name="searchbar"
                                    value={searchData.searchTerm}
                                    onChange={e => setSearchData({ ...searchData, searchTerm: e.target.value })}

                                />

                                {/* toggle search from name/types */}
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
                        <div></div> //shows empty div if hidden

                    }
                </Row>

                {/* alert */}
                <Alert variant={variant} style={{ position: "fixed", top: "4rem" }} onClose={() => setShowA(false)} dismissible show={showA}>
                    {alertmsg}
                </Alert>
            </div>

            {/* cards in wishlist. hidden if fetching cards from API */}
            {!loading
                ?
                <Row className="px-4 py-4">

                    {/* manual padding div */}
                    <div style={{ height: "8vh" }} />

                    {/* number of cards fetched. shows no cards found if an error occurred */}
                    {error == "" ? <h4 className="pt-4">Found {filteredCards.length} cards {filteredCards.length >= 180 ? "(Loaded 180 cards)" : "(Loaded " + filteredCards.length + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}

                    {/* cards (from specificcards.jsx) */}
                    <SomeCards handleClick={handleShow} cards={filteredCards} />
                </Row>
                :
                <div />
            }

        </div>
    )
}