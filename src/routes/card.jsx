import { Card, Col } from "react-bootstrap";
import placeholder from "../assets/placeholder.png";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

function MtGCard() {

    const popover = (
        <Popover id="popover-basic">
            <Popover.Header as="h3">Card name</Popover.Header>
            <Popover.Body>
                <Button variant="primary">Add to collection</Button>
            </Popover.Body>
        </Popover>
    );


    return (
        <Col xs={6} sm={4} md={3} xl={2} xxl={1} className="py-2">
            <OverlayTrigger trigger="click" placement="top" overlay={popover}>
                <Button variant="link">
                    <img src={placeholder} width={"100%"}></img>
                </Button>
            </OverlayTrigger>
        </Col>
    )
}


export default MtGCard