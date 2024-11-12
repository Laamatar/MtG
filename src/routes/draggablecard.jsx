import { Card, Col, Form, Container, ListGroup } from "react-bootstrap";
import noimage from "../assets/noimage.png";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useDraggable } from "@dnd-kit/core";

import { CSS } from '@dnd-kit/utilities';

function MtGCardDrop(props) {


    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.card.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };
    var imageuri;

    if (props.card.image_uris != undefined) {
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }

    var gat;

    if (props.card.image_uris != undefined) {
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }

    var p, g, e, t, s, tl;

    try {
        p = props.card.prices.eur
    } catch (error) {
        p = "0"
    }
    try {
        g = props.card.related_uris.gatherer
    } catch (error) {
        g = ""
    }
    try {
        e = props.card.related_uris.edhrec
    } catch (error) {
        e = ""
    }
    try {
        t = props.card.purchase_uris.tgcplayer
    } catch (error) {
        t = ""
    }
    try {
        s = props.card.scryfall_uri
    } catch (error) {
        s = ""
    }
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
        <Col xs={12} sm={6} md={6} xl={4} xxl={3} className="py-2">
            <Container ref={setNodeRef} style={style} {...listeners} {...attributes}>
                <OverlayTrigger placement="bottom" overlay={popover}>
                    <Form onSubmit={props.onclick}>
                        <Form.Control type="text" defaultValue={props.card.name} id="name" className="d-none" />
                        <Form.Control type="text" defaultValue={props.card.oracle_text} id="oracle" className="d-none" />
                        <Form.Control type="text" defaultValue={p} id="price" className="d-none" />
                        <Form.Control type="text" defaultValue={g} id="gathererlink" className="d-none" />
                        <Form.Control type="text" defaultValue={e} id="edhrec" className="d-none" />
                        <Form.Control type="text" defaultValue={t} id="tgcplayer" className="d-none" />
                        <Form.Control type="text" defaultValue={s} id="scryfall" className="d-none" />
                        <Form.Control type="text" defaultValue={imageuri} id="imgsrc" className="d-none" />
                        <Form.Control type="text" defaultValue={tl} id="typeline" className="d-none" />
                        <Form.Control type="text" defaultValue={props.card.id} id="id" className="d-none" />
                        <Button variant="link" type="submit">
                            <img src={imageuri} width={"100%"}></img>
                            <p>{props.card.name}</p>
                        </Button>
                    </Form>
                </OverlayTrigger>
            </Container>
        </Col>
    )
}


export default MtGCardDrop