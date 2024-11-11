import { Card, Col } from "react-bootstrap";
import placeholder from "../assets/placeholder.png";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function MtGCard(props) {



    return (
        <Col xs={12} sm={6} md={4} xl={3} xxl={2} className="py-2">
            <Button variant="link" onClick={props.onclick}>
            <img src={placeholder} width={"100%"}></img>
            </Button>
        </Col>
    )
}


export default MtGCard