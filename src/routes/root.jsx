import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AllCards from "./allcards";

export default function Root() {
    return (
      <>
      <div> <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand>Main page</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">New deck</Nav.Link>
            <Nav.Link href="#link">Decks</Nav.Link>
            <NavDropdown title="Cards" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Browse all cards</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Owned cards
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Wishlist</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <AllCards></AllCards>
    </div>
      </>
    );
  }