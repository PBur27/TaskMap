import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';

function LogOutButton() {
    const navigate = useNavigate();

    const handleLogOut = () => {
        // You can add logout logic here (e.g., clearing tokens, etc.)
        navigate('/');  // Navigates to the home page ("/")
    };

    return (
        <Button className='btn btn-warning' onClick={handleLogOut}>Log Out</Button>
    );
}

export default LogOutButton;