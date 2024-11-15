# Magic the Gathering Deckbuilder

A deckbuilder for Magic the Gathering. This is a school project for a web programming class.

## Functionality:

* Create Magic the Gathering decks by dragging cards.
    * Filter cards by color, type and format
    * Search from card name or typeline
* Save decks to localStorage
* Load saved decks
* See information about the deck
    * Piecharts pf colors and card types
        * Types: land, creature, instant, sorcery, misc.
* Get a copyable list of cards in the deck, in "card name x n" formatting
* Browse all cards
    * CLicking on a card shows more information about it, including card price and links to common sites
        * Links to Gatherer, Scryfall, TGCPlayer and EDHRec
    * Add cards to collection or wishlist
* Browse collection and wishlist
    * Option to remove cards

## Used libraries and APIs

* [React Vite](https://vite.dev/)
* [React Bootstrap](https://react-bootstrap.netlify.app/)
* [React Router](https://reactrouter.com/en/main)
* [dnd kit](https://dndkit.com/)
* [React minimal pie chart](https://www.npmjs.com/package/react-minimal-pie-chart)
* [uniqid](https://www.npmjs.com/package/uniqid)
* [Scryfall API](https://scryfall.com/docs/api)
    
## Issues I have noticed

* When looking at cards in collection or wishlist, the cards do not load at first. The cards need to be refreshed using the supplied button.
    * One possible way to fix it could be to add a timed function to useEffect that waits a while and then refreshes the cards. This seems like a kludge solution, however, so I didn't implement it.
* Sometimes (some) buttons need to be clicked twice for them to do their thing. (I don't know why)
