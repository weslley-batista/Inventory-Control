import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import ProductManagement from './components/ProductManagement';
import RawMaterialManagement from './components/RawMaterialManagement';
import ProductionSuggestions from './components/ProductionSuggestions';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar className="navbar-custom" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <i className="bi bi-box-seam me-2"></i>
            Inventory Control
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto ms-3">
              <Nav.Link as={Link} to="/products">Products</Nav.Link>
              <Nav.Link as={Link} to="/raw-materials">Raw Materials</Nav.Link>
              <Nav.Link as={Link} to="/production">Production Suggestions</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5 mb-5">
        <Routes>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/raw-materials" element={<RawMaterialManagement />} />
          <Route path="/production" element={<ProductionSuggestions />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;

