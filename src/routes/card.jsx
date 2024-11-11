import { Card, Col, Form } from "react-bootstrap";
import noimage from "../assets/noimage.png";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function MtGCard(props) {


    var imageuri;

    if(props.card.image_uris != undefined){
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }
    
    var gat;

    if(props.card.image_uris != undefined){
        imageuri = props.card.image_uris.normal
    } else {
        imageuri = noimage;
    }

    return (
        <Col xs={12} sm={6} md={4} xl={3} xxl={2} className="py-2">
            <Form onSubmit={props.onclick}>
            <Form.Control type="text" defaultValue={props.card.name} id="name" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.oracle_text} id="oracle" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.prices.eur} id="price" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.related_uris.gatherer} id="gathererlink" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.related_uris.edhrec} id="edhrec" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.purchase_uris.tgcplayer} id="tgcplayer" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.scryfall_uri} id="scryfall" className="d-none"/>
            <Form.Control type="text" defaultValue={imageuri} id="imgsrc" className="d-none"/>
            <Form.Control type="text" defaultValue={props.card.type_line} id="typeline" className="d-none"/>
            <Button variant="link" type="submit">
            <img src={imageuri} width={"100%"}></img>
            <p>{props.card.name}</p>
            </Button>
            </Form>
        </Col>
    )
}


export default MtGCard