import MtGCard from "./card";
import uniqid from "uniqid";
import { Row, Col, Button } from "react-bootstrap";
import { useState } from "react";

/**
 * 
 * specificcards.jsx
 * 
 * Returns given cards as MtGCard -elements
 * 
 */
function SomeCards(props) {

    //current page number
    const [pagenum, setpagenum] = useState(1)

    //increase page number
    function nextPage() {
        setpagenum(pagenum + 1)
    }

    //decrease page number
    function prevPage() {
        setpagenum(pagenum - 1)
    }

    return (
        <div className="mt-4">
            <Row>

                {/* maps fetched cards and creates corresponding MtGCard elements for them (from card.jsx) */}
                {props.cards.map(function (card, i) {
                    if (i < pagenum * 20 && i >= pagenum * 20 - 20) {

                        return <MtGCard key={uniqid()} card={props.cards[i]} onclick={props.handleClick}></MtGCard>
                    }
                })}
            </Row>


            {/* if cards are defined, shows page controls */}
            {props.cards != undefined
                ?
                <Row className="d-flex pt-4">


                    <h4>Showing results from {pagenum * 20 - 20} to {pagenum * 20}</h4>
                    <Col xs={5} className="d-flex align-items-center justify-content-center">
                        {pagenum == 1 ? <div></div> : <Button variant="secondary" style={{ width: "50%" }} onClick={prevPage}>Previous page</Button>}
                        
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><h5>Page {pagenum}</h5></Col>
                    <Col xs={5} className="d-flex align-items-center justify-content-center">
                        {pagenum == 9 ? <div></div> : <Button variant="secondary" style={{ width: "50%" }} onClick={nextPage}>Next page</Button>}


                    </Col>
                </Row>
                :
                <div />}

        </div>
    )
}

export default SomeCards