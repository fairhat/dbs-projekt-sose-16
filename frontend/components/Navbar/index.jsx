import * as React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

export default class Navigation extends React.Component {
    render() {
        return (
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">DOGRACE</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Nav>
              <NavItem eventKey={1} href="#/">Home</NavItem>
              <NavItem eventKey={2} href="#/random/">Random</NavItem>
              <NavItem eventKey={3} href="#/race/">Virtuelles Hunderennen</NavItem>
            </Nav>
          </Navbar>
        )
    }
}
