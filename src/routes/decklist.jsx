import { Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import DeckItem from "./listitem";
import uniqid from "uniqid"


/**
 * 
 * decklist.jsx
 * 
 * Shows given cards as a list 
 *  
 */


function Decklist(props) {

    //cards fetched by the API
    const [fetchedCards, setFetchedCards] = useState([])
    //given deck
    const [fd, setFD] = useState([])


    //fetches cards from API
    async function fetchData() {

        //initialize list of promises
        var promises = [];

        //go over all cards in the deck
        for (let i = 0; i < props.deck.length; i++) {
            //add function call of fetching card data of given id to promises
            promises.push(getData(props.deck[i].id));
        }
        

        //asynchronously execute all promises and wait for the results
        await Promise.all(promises).then(results => {
            //set results as fetched cards
            setFetchedCards(results)
            //set props.deck as the given deck 
            setFD(props.deck)
        }
        );
    }

    //useEffect is ran when props.deck changes
    useEffect(() => {

        //get card data from API (decklist card information is stored as card id)
        fetchData()

    }, [props.deck]);


    //asynchronous function that fetches card data of card with given id from the Scryfall API 
    async function getData(id) {

        return await fetch("https://api.scryfall.com/cards/" + id)
            .then(response => response.json())
            .then(result => {
                if (result.object == "error") {

                } else {

                    return (result)
                }
            });

    }

    //if element is created in deckbuilder, it has add and remove functionality. if element is created in decks, it doesn't
    var addRemoveFunctionality = !props.fromDecks

    return (
        <div className="mt-4">
            <Row id="decklistRow">
                
                {/* go over all cards and create a DeckItem -element for each (element from listitem.jsx) */}
                {fetchedCards.map(function (card, i) {
                    return <DeckItem  card={card} addremove={addRemoveFunctionality} cardamount={fd[i].amount} key={uniqid()} removeCard={props.removeCard} addCard={props.addCard}></DeckItem>
                }
                )}
            </Row>

        </div>
    )
}

export default Decklist