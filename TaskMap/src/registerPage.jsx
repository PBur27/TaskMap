
import { Container, Form, Button, Card } from 'react-bootstrap';

const RegisterPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-lg">
        <Card.Body>
          <h3 className="text-center mb-4">Registration Page</h3>
          
          {/* Email/Password Login */}
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group controlId="formPasswordConfirm" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Create an account
            </Button>
          </Form>

          {/* Google Login */}
          <Button variant="outline-danger" className="w-100 ">
            <i className="bi bi-google me-2"></i> Login with Google
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;