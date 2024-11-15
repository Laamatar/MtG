import { Row, Col, Button, ListGroup } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import noimage from "../assets/noimage.png";


/**
 * 
 * listitem.jsx
 * 
 * Creates a list element from a given card.
 * 
 */

function DeckItem(props) {


    //handles card removal functionality (for deckbuilding)
    function handleRemove(id) {
        props.removeCard(id)
    }

    //handles card adding functionality (for deckbuilding)
    function handleAdd(id) {
        props.addCard(id)
    }


    //try to get image location and card types, gives defaults if unable
    var imageuri;
    try {
        imageuri = props.card.image_uris.normal
    } catch (error) {
        imageuri = noimage;
    }
    var tl;
    try {
        tl = props.card.type_line
    } catch (error) {
        tl = ""
    }

    //popover that shows when hovering over the list item
    const popover = (
        <Popover id="popover-card">
            <Popover.Header as="h3"></Popover.Header>

            {/* card image */}
            <img src={imageuri} width={"100%"}></img>
            <Popover.Body>

                {/* card name */}
                <h4>{props.card.name}</h4>

                {/* card types */}
                <h6>{tl}</h6>

                {/* card text */}
                {props.card.oracle_text}

            </Popover.Body>
        </Popover>
    );


    return (
        <OverlayTrigger placement="bottom-start" overlay={popover}>

            <ListGroup.Item className="ps-2 py-2 border align-content-center justify-content-center" >

                <Row>
                    {/* card name */}
                    {props.addremove ? <Col xs={3}>{props.card.name}</Col> : <Col xs={4}>{props.card.name}</Col>}

                    {/* card cost */}
                    {props.addremove ? <Col xs={2}>{props.card.mana_cost}</Col> : <Col xs={3}>{props.card.mana_cost}</Col>}

                    {props.addremove ? <Col xs={3}>{tl}</Col> : <Col xs={4}>{tl}</Col>}

                    {/* number of cards in deck */}
                    {props.addremove ? <Col xs={1}>{props.cardamount}</Col> : <Col xs={1}>{props.cardamount}</Col>}

                    {/* add and remove -buttons if in deckbuilder */}
                    {props.addremove ? <Col xs={3}> <Button onClick={(e) => handleRemove(props.card.id)} variant="outline-danger" className="me-1" style={{ width: "2.4rem" }}>-</Button><Button onClick={(e) => handleAdd(props.card.id)} variant="outline-success" style={{ width: "2.4rem" }}>+</Button></Col> : <div />}
                </Row>
            </ListGroup.Item>
        </OverlayTrigger>
    )
}

export default DeckItem