import { Row, Col, Button, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import noimage from "../assets/noimage.png";


function DeckItem(props) {


    var imageuri;
    if (props.card.image_uris != undefined) {
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }
    var tl;
    try {
        tl = props.card.type_line
    } catch (error) {
        tl = ""
    }
    const popover = (
        <Popover id="popover-card">

            <img src={imageuri} width={"100%"}></img>
            <Popover.Header as="h3">{props.card.name}</Popover.Header>
            <Popover.Body>
                <h6>{tl}</h6>
                {props.card.oracle_text}

            </Popover.Body>
        </Popover>
    );


    return (
        <OverlayTrigger placement="left" overlay={popover}>

            <ListGroup.Item className="ps-2 py-2 border align-content-center justify-content-center" >
                <Row>
                    <Col xs={4}>{props.card.name}</Col>
                    <Col xs={2}>{props.card.mana_cost}</Col>
                    <Col xs={4}>{tl}</Col>
                    <Col xs={2}>{props.cardamount}</Col>
                </Row>
            </ListGroup.Item>
        </OverlayTrigger>
    )
}

export default DeckItem