import SomeCards from "./specificcards"
import { Row, Col, Button, Form, Offcanvas, ListGroup, Container } from "react-bootstrap"
import placeholder from "../assets/placeholder.png";
import { useState, useEffect } from "react";


export default function Wishlist() {

    const [wishlist, setWishlist] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
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

    const [cards, setCards] = useState([]);

    const handleClose = () => setShow(false);

    function handleShow(e) {
        e.preventDefault();
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
        setSelectedCard(cardinfo);
        setShow(true);

    }

    function toggleShowFilters() {
        if (showFilters) {
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }

    useEffect(() => {
        var wl = JSON.parse(localStorage.getItem("wishlist"))
        setWishlist(wl);
        console.log(wishlist)
        fetchData(true)

    }, []);

    function refreshData() {
        console.log(cards)
        setFilteredCards(cards)
    }



    async function fetchData() {
        var promises = [];
        for (let i = 0; i < JSON.parse(localStorage.getItem("wishlist")).length; i++) {
            console.log(i)
            promises.push(getData(JSON.parse(localStorage.getItem("wishlist"))[i]));
        }
        setLoading(true)
        await Promise.all(promises).then(results => setCards(results)).then(
            setLoading(false)
        );
    }

    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    console.log(result.code)
                    console.log(result.details)
                    setError("No cards found.")
                } else {
                    setError("");
                    console.log(result)
                    return (result)
                }
            });

    }




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
        console.log(cards);
        var colorfiltered = []
        var filtered = []

        for (let i = 0; i < cards.length; i++) {

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

        var typefiltered = []
        for (let i = 0; i < colorfiltered.length; i++) {
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

        var searchfiltered = []

        for (let i = 0; i < typefiltered.length; i++) {
            if (searchData.searchTerm != "") {
                if (typefiltered[i].name.toLowerCase().includes(searchData.searchTerm.toLowerCase())) {
                    searchfiltered.push(typefiltered[i])
                }

            } else {
                searchfiltered.push(typefiltered[i])

            }


        }

        var formatfiltered = []

        for (let i = 0; i < typefiltered.length; i++) {
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



        setFilteredCards(formatfiltered);
    }


    function addToLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
        console.log(JSON.parse(localStorage.getItem(name)))
        console.log("add to local storage : " + name)
        fetchData()

    }

    function removeFromWishlist(e) {
        e.preventDefault();
        var wl = JSON.parse(localStorage.getItem("wishlist"))
        var id = e.target.elements.idselected.value;
        if (wl.includes(id)) {
            console.log(id)
            wl.splice(wl.indexOf(id), 1);
            addToLocalStorage("wishlist", wl)
        }

    }



    return (
        <Container fluid>
            <Offcanvas show={show} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{selectedCard.name}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <img src={selectedCard.img} width={"100%"} className="my-4"></img>
                    <h4>{selectedCard.types}</h4>

                    {selectedCard.oracle.split(".").map(function (item, idx) {
                        return (
                            <span key={idx}>
                                {item + ". "}
                            </span>
                        )
                    })
                    }

                    <h5 className="py-4">Price {selectedCard.price}€</h5>


                    <ListGroup>
                        <ListGroup.Item><a href={selectedCard.scryfall} target="_blank">Scryfall</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.gatherer} target="_blank">Gatherer</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.edhrec} target="_blank">EDHrec</a></ListGroup.Item>
                        <ListGroup.Item><a href={selectedCard.tgcplayer} target="_blank">TGCPlayer</a></ListGroup.Item>
                    </ListGroup>
                    <Form onSubmit={removeFromWishlist}>
                        <Form.Control type="text" defaultValue={selectedCard.id} id="idselected" className="d-none" />
                        <Container className="d-flex align-items-center justify-content-center mt-4">
                            <Button variant="danger" type="submit">Remove from wishlist</Button>
                        </Container>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            <div style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row>

                    <Container className="py-4 ps-4">
                        <Button variant="secondary" onClick={refreshData} style={{ width: "15rem" }}>Reset filters and refresh cards</Button>
                    </Container>
                    <Button variant="outline-secondary" onClick={toggleShowFilters} >{showFilters ? "Hide filter options" : "Show filter options"}</Button>
                    {showFilters
                        ?
                        <Form className="ps-4" onSubmit={handleSearchSubmit} value={searchData} onChange={handleChange}>
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
            {!loading
                ?
                <Row className="px-4 py-4">
                    <div style={{ height: "8vh" }} />
                    {error == "" ? <h4 className="pt-4">Found {filteredCards.length} cards {filteredCards.length >= 180 ? "(Loaded 180 cards)" : "(Loaded " + filteredCards.length + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}
                    <SomeCards handleClick={handleShow} cards={filteredCards} />
                </Row>
                :
                <div />
            }

        </Container>
    )
}