
import MtGCardDrop from "./draggablecard";
import uniqid from "uniqid";
import { Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function AllCardsDrop(props) {

    const [pagenum, setpagenum] = useState(1)
    const [fetchedCards, setFetchedCards] = useState([])
    // for (let i = 0; i < 20; i++) {
    //     // note: we are adding a key prop here to allow react to uniquely identify each
    //     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
    //     rows.push(<MtGCard key={uniqid()} onclick={props.handleClick} />);
    // }



    useEffect(() => {
        if (props.cards != undefined) {
            setFetchedCards(props.cards.data);
        }
    }, []);

    function nextPage() {
        setpagenum(pagenum + 1)
    }
    function prevPage() {
        setpagenum(pagenum - 1)
    }

    return (
        <div className="mt-4">
            <Row>
                {fetchedCards.map(function (card, i) {
                    if (i < pagenum * 20 && i >= pagenum * 20 - 20) {
                        return <MtGCardDrop key={uniqid()} card={card} onclick={props.handleClick} ></MtGCardDrop>
                    }
                })}
            </Row>

            <h4>Showing results from {pagenum*20-20} to {pagenum*20}</h4>
            {props.cards != undefined
                ?
                <Row className="d-flex pt-4">
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

export default AllCardsDrop