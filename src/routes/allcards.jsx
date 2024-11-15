import MtGCard from "./card";
import uniqid from "uniqid";
import { Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

/**
 * 
 * allcards.jsx
 * 
 * Returns cards given as a prop in a nice format.
 * 
 */


function AllCards(props) {

    //current page number
    const [pagenum, setpagenum] = useState(1)

    //cards fetched by Scryfall API
    const [fetchedCards, setFetchedCards] = useState([])


    //useEffect is run once when the page loads
    useEffect(() => {

        //if cards given as props are defined, set fetched cards
        if (props.cards != undefined) {
            setFetchedCards(props.cards.data);
        }

    }, []);

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
                {fetchedCards.map(function (card, i) {

                    //shows only 20 cards per page
                    if (i < pagenum * 20 && i >= pagenum * 20 - 20) {
                        return <MtGCard key={uniqid()} card={card} onclick={props.handleClick}></MtGCard>
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
                        {pagenum == 9 || props.cards.data.length <= 20 ? <div></div> : <Button variant="secondary" style={{ width: "50%" }} onClick={nextPage}>Next page</Button>}


                    </Col>
                </Row>
                :
                <div />}

        </div>
    )
}

export default AllCards