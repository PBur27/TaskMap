
import { Container, Row, Col, Button } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-light text-center py-5">
        <Container>
          <h1 className="display-4 fw-bold">Welcome to MyApp</h1>
          <p className="lead mt-3">
            Your one-stop solution for secure login, fast access, and smooth user experience.
          </p>
          <Button variant="primary" size="lg" className="mt-4">
            Get Started
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="text-center">
            <Col md={4} className="mb-4">
              <i className="bi bi-shield-lock-fill display-4 text-primary mb-3"></i>
              <h4>Secure Auth</h4>
              <p>Login safely with Firebase and Google authentication.</p>
            </Col>
            <Col md={4} className="mb-4">
              <i className="bi bi-lightning-charge-fill display-4 text-warning mb-3"></i>
              <h4>Fast Access</h4>
              <p>Instant access to your dashboard with minimal delay.</p>
            </Col>
            <Col md={4} className="mb-4">
              <i className="bi bi-phone display-4 text-success mb-3"></i>
              <h4>Mobile Ready</h4>
              <p>Fully responsive and optimized for mobile devices.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light text-center py-3">
        <Container>
          <small>© 2025 MyApp. All rights reserved.</small>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;
