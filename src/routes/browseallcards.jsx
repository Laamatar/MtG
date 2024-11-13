import AllCards from "./allcards"
import { Row, Col, Button, Form, Offcanvas, ListGroup, Container } from "react-bootstrap"
import placeholder from "../assets/placeholder.png";
import { useState, useEffect } from "react";


export default function BrowseAllCards() {

    const [show, setShow] = useState(false);
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

    function addToLocalStorage(name, value) {
        localStorage.setItem(name, JSON.stringify(value))
        console.log(JSON.parse(localStorage.getItem(name)))
        console.log("add to local storage : " + name)

    }


    async function addToCollection(e) {
        e.preventDefault();
        var col = JSON.parse(localStorage.getItem("collection"))
        var id = e.target.elements.idOfSelectedCardC.value;
        if (col.length != 0) {
            if (!col.includes(id)) {
                console.log(id)
                col.push(id)
                addToLocalStorage("collection", col)
            }
        } else {
            console.log(id)
            col.push(id)
            addToLocalStorage("collection", col)
        }
    }

    async function addToWishlist(e) {
        e.preventDefault();
        var wl = JSON.parse(localStorage.getItem("wishlist"))
        var id = e.target.elements.idOfSelectedCardWL.value;
        if (wl.length != 0) {
            if (!wl.includes(id)) {
                console.log(id)
                wl.push(id)
                addToLocalStorage("wishlist", wl)
            }
        } else {
            console.log(id)
            wl.push(id)
            addToLocalStorage("wishlist", wl)
        }
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

    }, [APIsearch]);


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

    }



    return (
        <div className="d-flex">
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




                    <Row className="d-flex pt-4">
                        <Form onSubmit={addToCollection}>
                            <Form.Control type="text" defaultValue={selectedCard.id} id="idOfSelectedCardC" className="d-none" />
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="primary" type="submit" style={{ width: "90%" }}>Add to collection</Button>
                            </Col>
                        </Form>
                        <Form onSubmit={addToWishlist}>
                            <Form.Control type="text" defaultValue={selectedCard.id} id="idOfSelectedCardWL" className="d-none" />
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="secondary" type="submit" style={{ width: "90%" }}>Add to wishlist</Button>
                            </Col>
                        </Form>
                    </Row>
                </Offcanvas.Body>
            </Offcanvas>

            <div className='d-flex justify-content-center align-content-center mt-2' style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                <Row className='d-flex mt-4 justify-content-center align-content-center' style={{ width: "100%" }}>
                    <Button variant="outline-secondary" onClick={toggleShowFilters} style={{ width: "100%" }} className='mt-4'>{showFilters ? "Hide filter options" : "Show filter options"}</Button>
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
            {!loading
                ?
                <Row className="px-4 py-4">
                    <div style={{ height: "5vh" }} />
                    {error == "" ? <h4 className="pt-4">Found {cardsFoundNum} cards {cardsFoundNum >= 180 ? "(Loaded 180 cards)" : "(Loaded " + cardsFoundNum + " cards)"}</h4> : <h4 className="pt-4">{error}</h4>}
                    <AllCards handleClick={handleShow} cards={cards} />
                </Row>
                :
                <div />
            }

        </div>
    )
}