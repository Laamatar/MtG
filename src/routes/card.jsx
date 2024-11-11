import { Card, Col } from "react-bootstrap";
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

    return (
        <Col xs={12} sm={6} md={4} xl={3} xxl={2} className="py-2">
            <Button variant="link" onClick={props.onclick}>
            <img src={imageuri} width={"100%"}></img>
            <p>{props.card.name}</p>
            </Button>
        </Col>
    )
}


export default MtGCard