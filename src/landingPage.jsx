import { useState, useEffect } from 'react';
import { Container, Form, Modal, Button } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup, useMap, Circle } from 'react-leaflet';
import { db } from './fireBase.jsx';
import { collection, setDoc, getDoc, doc } from "firebase/firestore";
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router';


const LandingPage = () => {
  useEffect(() => {

    handleGetInitialData()

  }, []);

  // Get the user ID from the router state
  const userId = useLocation().state;

  // State to store the list of tasks
  const [tasks, setTasks] = useState([]);

  // State to store the list of locations
  const [locations, setLocations] = useState([]);

  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  // State to control the type of the modal
  const [modalType, setModalType] = useState("task");

  // State to store the details of the new task being created
  const [newTask, setNewTask] = useState({
    title: '',
    date: '',
    time: '',
    position: null, // Task structure includes title, date, time, and position
  });

  // State to store the details of the new location being created
  const [newLocation, setNewLocation] = useState({
    title: '',
    position: null, // Location structure includes title, and position
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

  useEffect(() => {
    if (locations.length === 0) return; // prevent running on initial load

    //latlang is not accepted by firebase and here it is converted to plain numbers
    const plainLocations = locations.map(location => ({
      ...location,
      position: {
        lat: location.position.lat,
        lng: location.position.lng,
      }
    }));
    //finding the test collection
    try {
      const colRef = collection(db, "CustomLocations");
      //updating a document named with user id with the task list (latlang changed)
      setDoc(doc(colRef, userId), {
        locations: plainLocations,
      });
      alert("Data added successfully!");
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save data. Please try again.");
    }
  }, [locations, userId]); // only run when tasks changes
  /* 
  !!!
  IN THE FUTURE WHEN THE TASKS ARE LOADED FROM FIREBASE AND MAPPED OVER THE MAP 
  LATITUDE AND LONGITUDE NEEDS TO BE PARSED INTO A REACT LEAFLET ELEMENT
  !!!
  */

  // Function that returns the initial state of the firestore database to an array
  async function handleGetInitialData() //funkcje trzeba wykonać podczas władowania strony?
  {
    // fetch the data from firestore
    const colRefTasks = collection(db, "TestCollection");
    const docSnapTasks = await getDoc(doc(colRefTasks, userId));
    const initialTasks = [];

    const colRefLocations = collection(db, "CustomLocations");
    const docSnapLocations = await getDoc(doc(colRefLocations, userId));
    const initialLocations = [];

    // check if the loaded data is empty or not
    if (docSnapTasks.data() != undefined) {
      const docData = docSnapTasks.data();

      for (let i = 0; i < docData.tasks.length; i++) {
        initialTasks.push(docData.tasks[i]);
      }
    }
    else {
      console.log("No documents available.")
    }
    if (docSnapLocations.data() != undefined) {
      const docData = docSnapLocations.data();

      for (let i = 0; i < docData.locations.length; i++) {
        initialLocations.push(docData.locations[i]);
      }
    }
    else {
      console.log("No documents available.")
    }
    // Get the data from firestore and if it exists push it to an array
    // if the opposite is true return an empty array and a message to console
    setTasks(initialTasks);
    setLocations(initialLocations);

  }

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
    if (modalType === 'task') {
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
    }
    else if (modalType === 'location') {
      if (!newLocation.title || !newLocation.position) {
        alert("Please fill in all fields before saving the location.");
        return;
      }
      // Check for duplicate locations
      const isDuplicate = locations.some(
        (location) =>
          location.title === newTask.title &&
          location.position?.lat === newTask.position?.lat &&
          location.position?.lng === newTask.position?.lng
      );
      if (!isDuplicate) {
        // Add the new task to the tasks array
        setLocations([...locations, newLocation]);
      } else {
        alert("This location already exists!");
      }
    }

    // Close the modal
    handleModalClose();
  }

  // Function to add a new task when the map is clicked
  function addNewTask(clickLatLng) {
    setModalType("task");
    setNewTask((prevTask) => ({ ...prevTask, position: clickLatLng }));
    setShowModal(true);
  }
  function addNewLocation(clickLatLng) {
    setModalType('location'); // Set modal type to 'location'
    setNewLocation((prevLocation) => ({ ...prevLocation, position: clickLatLng }));
    setShowModal(true);

  }

  // Component to handle map click events
  function MapControl() {

    let pressTimer = null;

    useMapEvents({
      mousedown(e) {
        // Start the timer when the mouse button is pressed
        pressTimer = setTimeout(() => {
          const clickLatLng = e.latlng;
          addNewLocation(clickLatLng); // Trigger long-press action (e.g., add location)
        }, 500); // 500ms threshold for long press
      },
      mouseup() {
        // Clear the timer if the mouse button is released before 500ms
        clearTimeout(pressTimer);
      },
      click(e) {
        const clickLatLng = e.latlng;
        addNewTask(clickLatLng);
      },
    });
    return null;
  }

  const LocateUser = () => {
    const map = useMap();

    useMapEvents({
      load: () => {
        // Trigger map.locate only when the map is fully loaded
        map.locate({ setView: true, maxZoom: 16 });
      },
    });

    return null;
  };
  const LocateUserButton = () => {
    const map = useMap();

    const handleClick = () => {
      map.locate({ setView: true, maxZoom: 16 });
    };

    return (
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000, pointerEvents: 'auto', }}>
        <Button variant="primary" onClick={handleClick}>
          Center Map
        </Button>
      </div>
    );
  };


  return (
    <Container>

      <div className='py-3 text-center' id="welcomeImage">
        <img src='./src/assets/TaskMapAlt.png' height='90vh'></img>
      </div>

      <MapContainer
        center={[50.06, 19.93]} // Initial map center coordinates
        zoom={13} // Initial zoom level
        style={{ height: '80vh', width: '100%', borderRadius: '0px 0px 15px 15px' }} // Improved responsiveness for mobile
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render markers for each task */}
        {tasks.map((task, id) => (
          <Marker
            key={id}
            position={task.position}
            title={task.title}>
            <Popup>
              <div>
                <strong>{task.title}</strong>
                <br />
                <span>Date: {task.date}</span>
                <br />
                <span>Time: {task.time}</span>
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

        {/* Render circles for each location */}
        {locations.map((location, id) => (
          <Circle
            key={id}
            center={location.position}
            radius={600}
            pathOptions={{ color: 'red' }}
          >
            <Popup>
              <div>
                <strong>{location.title}</strong>
                <br />
                {/* Button to delete the location */}
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => {
                    const updatedLocations = locations.filter((_, index) => index !== id);
                    setLocations(updatedLocations);
                  }}
                >
                  Delete Location
                </button>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Add map click control */}
        <LocateUser />
        <LocateUserButton />
        <MapControl />
      </MapContainer>

      {/* Testing!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}

      {/* Modal for adding a new task */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'task' ? 'Add New Task' : 'Add New Location'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleModalSave}>
            {modalType === 'task' && (
              <>
                {/* Fields for adding a task */}
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
              </>
            )}
            {modalType === 'location' && (
              <>
                {/* Fields for adding a location */}
                <Form.Group className="mb-3" controlId="formLocationTitle">
                  <Form.Label>Location Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter location name"
                    name="title"
                    value={newLocation.title}
                    onChange={(e) =>
                      setNewLocation((prevLocation) => ({
                        ...prevLocation,
                        title: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </>
            )}
            <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save {modalType === 'task' ? 'Task' : 'Location'}
            </button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default LandingPage;