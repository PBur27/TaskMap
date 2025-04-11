import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const LandingPage = () => {

  const [markers, setMarkers] = useState([])

  function MapControl() {
    useMapEvents({
  
      click(e) {
        const clickLatLng = e.latlng;
        const sameMarkerThreshold = 250;
  
        const markerCloseEnough = markers.findIndex(
          //loop through markers array to find the index of a marker which is close enough to clickLatLang (sameMarkerThreshold)
          (marker) => {
            const markerPos = L.latLng(marker.lat,marker.lng);
            console.log(markerPos.distanceTo(clickLatLng))
            return markerPos.distanceTo(clickLatLng) < sameMarkerThreshold;
            //if marker close enough exists findIndex returns the index of the marker, if not it returns -1
          }
        )
  
        if (markerCloseEnough != -1){
          const updated = [...markers];
          updated.splice(markerCloseEnough, 1);
          setMarkers(updated);
        }
        else{setMarkers([...markers, clickLatLng]);}
  
      }
  
    })
  }

  return (
    <Container>
      <h1 className="display-4 fw-bold">Welcome to MyApp</h1>
      <MapContainer
        center={[50.06, 19.93]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {markers.map((pos, id) => (
          <Marker key={id} position={pos}>
          </Marker>
        ))}

        <MapControl/>
      </MapContainer>
    </Container>
  );
};

export default LandingPage;