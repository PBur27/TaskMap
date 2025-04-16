import { useState } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { auth } from './fireBase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';


const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let userId = '';
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          userId = userCredential.user.uid;
        }
      );
      navigate('/home', { state: userId });
      // success!
    } catch (err) {
      console.error("Login error:", err);
    }

  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-lg">
        <Card.Body>
          <h3 className="text-center mb-4">Login</h3>

          {/* Email/Password Login */}
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>

          <div className="text-center my-3">
            <small className="text-muted">OR</small>
          </div>

          {/* Google Login */}
          <Button variant="outline-danger" className="w-100 mb-3">
            <i className="bi bi-google me-2"></i> Login with Google
          </Button>
          <Button variant="outline-secondary" className="w-100 mb-3" onClick={() => navigate('/register')}>
            <i className="bi  me-2"></i> Create an account
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;