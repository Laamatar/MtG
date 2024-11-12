import { Row, Col, Button, ListGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import DeckItem from "./listitem";
import uniqid from "uniqid"

function Decklist(props) {

    const [fetchedCards, setFetchedCards] = useState([])
    const [fd, setFD] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    // for (let i = 0; i < 20; i++) {
    //     // note: we are adding a key prop here to allow react to uniquely identify each
    //     // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
    //     rows.push(<MtGCard key={uniqid()} onclick={props.handleClick} />);
    // }


    async function fetchData() {
        var promises = [];
        for (let i = 0; i < props.deck.length; i++) {
            console.log(i)
            promises.push(getData(props.deck[i].id));
        }
        setLoading(true)
        await Promise.all(promises).then(results => {
            setFetchedCards(results)
            setFD(props.deck)
        }
        ).then(setLoading(false));
    }

    useEffect(() => {

        fetchData()

    }, [props.deck]);


    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {
                    console.log(result.code)
                    console.log(result.details)
                    setError("No cards found.")
                } else {
                    setError("");
                    console.log(result)

                    return (result)
                }
            });

    }



    return (
        <div className="mt-4">
            <Row id="decklistRow">
                {fetchedCards.map(function (card, i) {
                    return <DeckItem card={card} cardamount={fd[i].amount} key={uniqid()}></DeckItem>
                }
                )}
            </Row>

        </div>
    )
}

export default Decklist