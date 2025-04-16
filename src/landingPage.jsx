import { useState, useEffect } from 'react';
import { Container, Form, Modal } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup } from 'react-leaflet';
import { db } from './fireBase.jsx';
import { collection, setDoc, doc } from "firebase/firestore";
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router';

const LandingPage = () => {
  // Get the user ID from the router state
  const userId = useLocation().state;

  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);

  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  // State to store the details of the new task being created
  const [newTask, setNewTask] = useState({
    title: '',
    date: '',
    time: '',
    position: null, // Task structure includes title, date, time, and position
  });

  useEffect(() => {
    if (tasks.length === 0) return; // prevent running on initial load
  
    //latlang is not accepted by firebase and here it is converted to plain numbers
    const plainTasks = tasks.map(task => ({
      ...task,
      position: {
        lat: task.position.lat,
        lng: task.position.lng,
      }
    }));
    //finding the test collection
    try {
      const colRef = collection(db, "TestCollection");
      //updating a document named with user id with the task list (latlang changed)
      setDoc(doc(colRef, userId), {
        tasks: plainTasks,
      });
      alert("Data added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save data. Please try again.");
    }
  }, [tasks, userId]); // only run when tasks changes
  /* 
  !!!
  IN THE FUTURE WHEN THE TASKS ARE LOADED FROM FIREBASE AND MAPPED OVER THE MAP 
  LATITUDE AND LONGITUDE NEEDS TO BE PARSED INTO A REACT LEAFLET ELEMENT
  !!!
  */


  // Function to handle input changes in the form
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  }

  // Function to close the modal and reset the new task state
  function handleModalClose() {
    setShowModal(false);
    setNewTask({ title: '', date: '', time: '', position: null });
  }

  // Function to save the new task to the tasks array
  function handleModalSave(event) {
    event.preventDefault()
    // Validate that all fields are filled
    if (!newTask.title || !newTask.date || !newTask.time || !newTask.position) {
      alert("Please fill in all fields before saving the task.");
      return;
    }

    // Check for duplicate tasks
    const isDuplicate = tasks.some(
      (task) =>
        task.title === newTask.title &&
        task.date === newTask.date &&
        task.time === newTask.time &&
        task.position?.lat === newTask.position?.lat &&
        task.position?.lng === newTask.position?.lng
    );

    if (!isDuplicate) {
      // Add the new task to the tasks array
      setTasks([...tasks, newTask]);
    } else {
      alert("This task already exists!");
    }

    // Close the modal
    handleModalClose();
  }


  // Function to add a new task when the map is clicked
  function addNewTask(clickLatLng) {
    setNewTask((prevTask) => ({ ...prevTask, position: clickLatLng }));
    setShowModal(true);
  }

  // Component to handle map click events
  function MapControl() {
    useMapEvents({
      click(e) {
        const clickLatLng = e.latlng;
        addNewTask(clickLatLng);
      },
    });
    return null;
  }

  return (
    <Container>
      <h1 className="display-4 fw-bold">Welcome to MyApp</h1>
      <MapContainer
        center={[50.06, 19.93]} // Initial map center coordinates
        zoom={13} // Initial zoom level
        style={{ height: '50vh', width: '100%' }} // Improved responsiveness for mobile
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render markers for each task */}
        {tasks.map((marker, id) => (
          <Marker key={id} position={marker.position} title={marker.title}>
            <Popup>
              <div>
                <strong>{marker.title}</strong>
                <br />
                <span>Date: {marker.date}</span>
                <br />
                <span>Time: {marker.time}</span>
                <br />
                {/* Button to delete the task */}
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => {
                    const updatedMarkers = tasks.filter((_, index) => index !== id);
                    setTasks(updatedMarkers);
                  }}
                >
                  Delete Task
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Add map click control */}
        <MapControl />
      </MapContainer>

      {/* Modal for adding a new task */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModalSave}>
            {/* Input for task name */}
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
            {/* Input for task date */}
            <Form.Group className="mb-3" controlId="formTaskDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newTask.date}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* Input for task time */}
            <Form.Group className="mb-3" controlId="formTaskTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={newTask.time}
                onChange={handleInputChange}
              />
            </Form.Group>
            {/* Buttons to cancel or save the task */}
            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Task
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LandingPage;