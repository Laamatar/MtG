
/**
 * 
 * index.jsx
 * 
 * Main page. Shows information about the site. 
 *  
 */


export default function Index() {
    return (
        <div style={{ width: "100vw" }}>

            {/* color block with text inside it */}
            <div className="d-flex justify-content-center" style={{ width: "100%", height: "20rem", background: "#adbca5" }}>

                <h1 className="mt-4 pt-4" style={{ color: "#ffffff" }}>Magic the Gathering Deckbuilder</h1>
            </div>

            {/* information about the site */}
            <p className="pt-4 mt-4 mx-4" style={{ fontSize: "24px" }}>Welcome to my deckbuilder. Using the navigation bar, you can start building a new deck,
                browse your built decks, or look through cards and add them to your collection and wishlist.
                <br />
                <br />
                You can add cards to your deck by dragging them to the right side of the screen.
                <br />
                <br />
                The site's functionality is not designed for mobile users, but theoretically it works on them as well. Dragging the cards is very difficult. The UI, however, is designed to be
                viewable in mobile and responsive to most screen sizes.
            </p>

        </div>
    )
}