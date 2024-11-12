import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AllCards from "./allcards";
import { Outlet, Link } from "react-router-dom";


export default function Root() {
    return (
      <>
      <div> <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand>
            <Link to={"index"}>Main page</Link>
            </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">New deck</Nav.Link>
            <Nav.Link href="#link">Decks</Nav.Link>
            <NavDropdown title="Cards" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
              <Link to={"browseallcards"}>Browse all cards</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
              <Link to={"collection"}>Collection</Link>
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Wishlist</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <div className="mt-5">
    <Outlet/>
    </div>
    </div>
      </>
    );
  }