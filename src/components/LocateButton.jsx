import { useMap } from 'react-leaflet';
import Button from 'react-bootstrap/Button';

function LocateButton() {
  const map = useMap();

  const handleClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
      <Button variant="primary" onClick={handleClick}>
        Locate Me
      </Button>
    </div>
  );
}

export default LocateButton;