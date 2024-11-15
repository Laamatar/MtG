import { Col, Form, Container } from "react-bootstrap";
import noimage from "../assets/noimage.png";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useDraggable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';


/**
 * 
 * draggablecard.jsx
 * 
 * Creates a draggable element of a given card.
 * 
 * Shows info:
 *  - name
 *  - image of card
 * 
 * Shows Popover on hover (focus on mobile):
 *  - name
 *  - image
 *  - card types
 *  - oracle text
 *  
 */

function MtGCardDrop(props) {


    //initializion for dnd kit drag and drop functionality
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: props.card.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    //initialize image location
    var imageuri;

    //if image location is undefined, use noimage -image. otherwise use API image.
    if (props.card.image_uris != undefined) {
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }

    //initialize card information variables
    var p, g, e, t, s, tl;

    /*
    following try - catch structures try to get card information, and give default values if for some reason it fails (e.g. card is undefined) 
    */

    //price
    try {
        p = props.card.prices.eur
    } catch (error) {
        p = "0"
    }

    //gatherer link
    try {
        g = props.card.related_uris.gatherer
    } catch (error) {
        g = ""
    }

    //edhrec link
    try {
        e = props.card.related_uris.edhrec
    } catch (error) {
        e = ""
    }

    //tgcplayer link
    try {
        t = props.card.purchase_uris.tgcplayer
    } catch (error) {
        t = ""
    }

    //scryfall link
    try {
        s = props.card.scryfall_uri
    } catch (error) {
        s = ""
    }

    //card types
    try {
        tl = props.card.type_line
    } catch (error) {
        tl = ""
    }


    //Popover of the card
    const popover = (
        <Popover id="popover-card">
            
            {/* card image */}
            <img src={imageuri} width={"100%"}></img>
            
            {/* card name */}
            <Popover.Header as="h3">{props.card.name}</Popover.Header>
            
            {/* card types and card text */}
            <Popover.Body>
                <h6>{tl}</h6>
                {props.card.oracle_text}

            </Popover.Body>
        </Popover>
    );

    return (
        <Col xs={12} sm={6} md={6} xl={4} xxl={3} className="py-2">

            {/* container for dragging functionality */}
            <Container ref={setNodeRef} style={style} {...listeners} {...attributes}>

                {/* hovering over the card shows the popover */}
                <OverlayTrigger placement="bottom" overlay={popover}>

                    {/* form with card info. forms are not displayed for the user */}
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