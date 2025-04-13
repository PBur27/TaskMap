import { useState } from 'react';
import { Container, Form, Modal } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LandingPage = () => {

  const [tasks, setTasks] = useState([])
  //empty list for tasks
  const [showModal, setShowModal] = useState(false);
  //state for form to appear when the map is clicked
  const [newTask, setNewTask] = useState({ title: '', date: '', time: '', position: null });
  //task structure = title, date, time and position

  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  }
  //new task creation helping function

  function handleModalClose() {
    setShowModal(false);
    setNewTask({ title: '', date: '', time: '', position: null });
  }
  //function that closes new task form

  function handleModalSave() {
    if (newTask.title) {
      setTasks([...tasks, newTask]);
    }
    handleModalClose();
  }
  //fuction that saves a new task to tasks arr

  function addNewTask(clickLatLng) {
    setNewTask((prevTask) => ({ ...prevTask, position: clickLatLng }));
    setShowModal(true);
  }
  //function that runs when the map is cliked

  function MapControl() {
    useMapEvents({
      click(e) {
        const clickLatLng = e.latlng;
        addNewTask(clickLatLng);
      },
    });
  }
  //usemapevents is a leaflet (maps) function that has preset events (like clicking the map)

  return (
    <Container>
      <h1 className="display-4 fw-bold">Welcome to MyApp</h1>
      <MapContainer
        center={[50.06, 19.93]}
        //Kraków coordiantes
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        //needs to be tested for mobile
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          //leaflet tool to add an image overlay to the map
        />

        {tasks.length >= 1 &&
        // if any tasks exist, put them on the map
          tasks.map((marker, id) => (
            <Marker key={id} position={marker.position} title={marker.title}>
              {/*leaflet element that marks the map and has a popup window with task info*/}
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
                      const updatedMarkers = tasks.filter((_, index) => index !== id);
                      setTasks(updatedMarkers);
                      //button to remove the task from the tasks array if the user clicks it
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
        {/*Modal is an element that "freezes" other parts of the app until it is closed, showModal controls its visibility (line:10)*/}
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
            {/*every time user changes a part of the form newTask object is being updated inside the function handleInputChange*/}
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
