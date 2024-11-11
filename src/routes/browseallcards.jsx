import AllCards from "./allcards"
import { Row, Col, Button, Form, Offcanvas } from "react-bootstrap"
import placeholder from "../assets/placeholder.png";
import { useState, useEffect } from "react";


export default function BrowseAllCards() {



    const [show, setShow] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function toggleShowFilters(){
        if(showFilters){
            setShowFilters(false);
        } else {
            setShowFilters(true);
        }
    }



    return (
        <div>
            <div>


                <Offcanvas show={show} onHide={handleClose} backdrop="static" placement="end">
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Card name</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <img src={placeholder} width={"100%"} className="my-4"></img>
                        <h4>Manacost:</h4>
                        <h4>Text: </h4>

                        <p>I will not close if you click outside of me.</p>
                        
                        <Row className="d-flex pt-4">
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="primary" style={{ width: "90%" }}>Add to collection</Button>
                            </Col>
                            <Col xs={6} className="d-flex align-items-center justify-content-center">
                                <Button variant="secondary" style={{ width: "90%" }}>Add to wishlist</Button>
                            </Col>
                        </Row>
                    </Offcanvas.Body>
                </Offcanvas>

                <div style={{ position: "fixed", background: "#f4f4f6", width: "100%" }}>
                    <Row>
                        <h2 className="pt-4 ps-4">Filter cards:</h2>
                        <Button variant="secondary" onClick={toggleShowFilters}>{showFilters ? "hide options" : "show options"}</Button>
                        {showFilters 
                        ?

                        <Form className="ps-4">
                            <Col xs={4}>

                                <p>Color:</p>
                                <Form.Check
                                    inline
                                    label="White"
                                    name="group1"
                                    type="checkbox"
                                    id={`inline-select-w`}
                                />
                                <Form.Check
                                    inline
                                    label="Blue"
                                    name="group1"
                                    type="checkbox"
                                    id={`inline-select-u`}
                                />
                                <Form.Check
                                    inline
                                    label="Black"
                                    type="checkbox"
                                    id={`inline-select-b`}
                                />
                                <Form.Check
                                    inline
                                    label="Red"
                                    type="checkbox"
                                    id={`inline-select-r`}
                                />
                                <Form.Check
                                    inline
                                    label="Green"
                                    type="checkbox"
                                    id={`inline-select-g`}
                                />

                            </Col>

                            <Col xs={6} className="py-2">

                                <Form.Label htmlFor="search">Search by name</Form.Label>
                                <Form.Control
                                    type="text"
                                    id="search"

                                />

                            </Col>
                        </Form>

                        :
                        <div></div>
                    
                        }
                    </Row>
                </div>
                <Row className="px-4 py-4">
                    <div style={{ height: "10vh"}} />
                    <AllCards handleClick={handleShow}/>
                    <Row className="d-flex pt-4">
                        <Col xs={6} className="d-flex align-items-center justify-content-center">
                            <Button variant="secondary" style={{ width: "50%" }}>Previous page</Button>
                        </Col>
                        <Col xs={6} className="d-flex align-items-center justify-content-center">
                            <Button variant="secondary" style={{ width: "50%" }}>Next page</Button>
                        </Col>
                    </Row>

                </Row>

            </div>
        </div>
    )
}