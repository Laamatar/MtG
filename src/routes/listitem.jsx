import { Row, Col, Button, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import noimage from "../assets/noimage.png";


function DeckItem(props) {


    function handleRemove(e, id){
        props.removeCard(id)
    }

    function handleAdd(e, id){
        props.addCard(id)
    }

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
    const popover = (
        <Popover id="popover-card">
            <Popover.Header as="h3"></Popover.Header>
            <img src={imageuri} width={"100%"}></img>
            <Popover.Body>
                <h4>{props.card.name}</h4>
                <h6>{tl}</h6>
                {props.card.oracle_text}

            </Popover.Body>
        </Popover>
    );


    return (
        <OverlayTrigger placement="bottom-start" overlay={popover}>

            <ListGroup.Item className="ps-2 py-2 border align-content-center justify-content-center" >
                <Row>
                    {props.addremove ? <Col xs={3}>{props.card.name}</Col> : <Col xs={4}>{props.card.name}</Col>}
                    {props.addremove ? <Col xs={2}>{props.card.mana_cost}</Col> : <Col xs={3}>{props.card.mana_cost}</Col>}
                    {props.addremove ? <Col xs={3}>{tl}</Col> : <Col xs={4}>{tl}</Col>}
                    {props.addremove ? <Col xs={1}>{props.cardamount}</Col> : <Col xs={1}>{props.cardamount}</Col>}
                    
                    
                    {props.addremove ? <Col xs={3}> <Button onClick={(e) => handleRemove(e, props.card.id)} variant="outline-danger" className="me-1" style={{width: "2.4rem"}}>-</Button><Button onClick={(e) => handleAdd(e, props.card.id)} variant="outline-success" style={{width: "2.4rem"}}>+</Button></Col> : <div/>}
                </Row>
            </ListGroup.Item>
        </OverlayTrigger>
    )
}

export default DeckItem