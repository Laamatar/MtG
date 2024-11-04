import { Card, Col } from "react-bootstrap";
import placeholder from "../assets/placeholder.png"

function MtGCard() {

    return (
        <Col xs={6} sm={4} md={3} xl={2} xxl={1} className="py-2">
            <img src={placeholder} width={"100%"}></img>
        </Col>
    )
}


export default MtGCard