
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "bootstrap-icons/font/bootstrap-icons.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const auth = getAuth();

    if (password == passwordConfirm) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/login");
          // log in success
        })
        .catch((error) => {                 //tu pop upy dac !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          switch (error.code) {
            case "auth/email-already-in-use":
              console.log(`Email address ${this.state.email} already in use.`);
              break;
            case "auth/invalid-email":
              console.log(`Email address ${this.state.email} is invalid.`);
              break;
            case "auth/operation-not-allowed":
              console.log(`Error during sign up.`);
              break;
            case "auth/weak-password":
              console.log(
                "Password is not strong enough. The password should be at least 6 characters long."
              );
              break;
            default:
              console.log(error.message);
              break;
          }
        });
      // log in failed
    } 
    else {
      alert("The passwords aren't identical.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow-lg">
        <Card.Body>
          
          <h3 className="text-center mb-4">Registration Page</h3>
          
          {/* Email/Password Login */}
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>

            <Form.Group controlId="formPasswordConfirm" className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPasswordConfirm(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" onClick={handleRegister}>
              Create an account
            </Button>
          </Form>

          <Button variant="btn btn-secondary" className="w-100 mb-3" onClick={() => navigate('/login')}>
              <i className="bi bi-arrow-return-left"></i> Return
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
