import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AllCards from "./allcards";
import { Outlet, Link } from "react-router-dom";


export default function Root() {
  return (
    <>
      <Container fluid>
        <Navbar expand="lg" className="bg-body-tertiary fixed-top">
          <Container>
            <Navbar.Brand>
              <Link to={"index"}>Main page</Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link>

                  <Link to={"deckbuilder"}>New deck</Link>
                </Nav.Link>
                <Nav.Link>
                  Decks
                </Nav.Link>
                <NavDropdown title="Cards" id="basic-nav-dropdown">
                  <NavDropdown.Item>
                    <Link to={"browseallcards"}>Browse all cards</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to={"collection"}>Collection</Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to={"wishlist"}>Wishlist</Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="mt-5 d-flex">
          <Outlet />
        </div>
      </Container>
    </>
  );
}