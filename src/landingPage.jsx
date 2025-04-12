import { useState } from 'react';
import { Container, Form, Modal } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// Removed unused import of L from 'leaflet'

const LandingPage = () => {

  const [markers, setMarkers] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', date: '', time: '', position: null });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  }

  function handleModalClose() {
    setShowModal(false);
    setNewTask({ title: '', date: '', time: '', position: null });
  }

  function handleModalSave() {
    if (newTask.title) {
      setMarkers([...markers, newTask]);
    }
    handleModalClose();
  }

  function addNewTask(clickLatLng) {
    setNewTask((prevTask) => ({ ...prevTask, position: clickLatLng }));
    setShowModal(true);
  }

  function MapControl() {
    useMapEvents({
      click(e) {
        const clickLatLng = e.latlng;
        addNewTask(clickLatLng);
      },
    });
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

        {markers.length >= 1 &&
          markers.map((marker, id) => (
            <Marker key={id} position={marker.position} title={marker.title}>
              <Popup>
                <div>
                  <strong>{marker.title}</strong>
                  <br />
                  <span>Date: {marker.date}</span>
                  <br />
                  <span>Time: {marker.time}</span>
                  <br />
                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => {
                      const updatedMarkers = markers.filter((_, index) => index !== id);
                      setMarkers(updatedMarkers);
                    }}
                  >
                    Delete Task
                  </button>
                </div>
              </Popup>
            </Marker>
          ))
        }

        <MapControl />
      </MapContainer>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formTaskTitle">
              <Form.Label>Task Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task name"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTaskDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newTask.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTaskTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newTask.time}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleModalClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleModalSave}>
            Save Task
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LandingPage;
