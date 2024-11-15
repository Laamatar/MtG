import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";

/**
 * 
 * root.jsx
 * 
 * Root for react router. Contains the navigation bar with links to other screens.
 * 
 */


export default function Root() {
  return (
    <>
      <div className="d-flex">

        {/* navbar */}
        <Navbar expand="lg" className="bg-body-tertiary fixed-top">
          <Container>

            {/* link to index.jsx */}
            <Navbar.Brand>
              <Link to={"index"}>Main page</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">

                {/* link to deckbuilder.jsx */}
                <Navbar.Brand>
                  <Link to={"deckbuilder"}>New deck</Link>
                </Navbar.Brand>

                {/* link to decks.jsx */}
                <Navbar.Brand>
                <Link to={"decks"}>Decks</Link>
                </Navbar.Brand>

                <NavDropdown title="Cards" id="basic-nav-dropdown">

                  {/* link to browseallcards.jsx */}
                  <NavDropdown.Item>
                    <Link to={"browseallcards"}>Browse all cards</Link>
                  </NavDropdown.Item>

                  {/* link to collection.jsx */}
                  <NavDropdown.Item>
                    <Link to={"collection"}>Collection</Link>
                  </NavDropdown.Item>

                  {/* link to wishlist.jsx */}
                  <NavDropdown.Item>
                    <Link to={"wishlist"}>Wishlist</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* outlet element. site content shown here */}
        <div className="mt-5 d-flex">
          <Outlet />
        </div>
      </div>
    </>
  );
}
