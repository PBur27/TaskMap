import { useState, useEffect, useRef } from 'react';
import { Container, Form, Modal, Button, Row, Col } from 'react-bootstrap';
import { MapContainer, Marker, TileLayer, useMapEvents, Popup, useMap, Circle } from 'react-leaflet';
import { db } from './fireBase.jsx';
import { collection, setDoc, getDoc, doc } from "firebase/firestore";
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router';
import { Icon } from 'leaflet';
import LogOutButton from './components/LogOutButton.jsx';
import TaskTypesButton from './components/TaskTypesButton.jsx';

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

  // State to store the list of locations
  const [taskTypes, setTaskTypes] = useState([]);

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
    type: '',
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
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to save data. Please try again.");
    }
  }, [locations, userId]); // only run when tasks changes

  useEffect(() => {
    if (taskTypes.length === 0) return; // Prevent running on initial load

    try {
      const colRef = collection(db, "TaskTypesCollection");
      setDoc(doc(colRef, userId), {
        taskTypes: taskTypes,
      });
      console.log("Task types updated:", taskTypes);
    } catch (e) {
      console.error("Error updating task types: ", e);
      alert("Failed to save task types. Please try again.");
    }
  }, [taskTypes, userId]); // Run whenever taskTypes or userId changes


  /* 
  !!!
  IN THE FUTURE WHEN THE TASKS ARE LOADED FROM FIREBASE AND MAPPED OVER THE MAP 
  LATITUDE AND LONGITUDE NEEDS TO BE PARSED INTO A REACT LEAFLET ELEMENT
  !!!
  */

  // Function that returns the initial state of the firestore database to an array
  async function handleGetInitialData() {
    // Fetch the data from Firestore
    const colRefTasks = collection(db, "TestCollection");
    const docSnapTasks = await getDoc(doc(colRefTasks, userId));
    const initialTasks = [];

    const colRefLocations = collection(db, "CustomLocations");
    const docSnapLocations = await getDoc(doc(colRefLocations, userId));
    const initialLocations = [];

    const colRefTaskTypes = collection(db, "TaskTypesCollection");
    const docSnapTaskTypes = await getDoc(doc(colRefTaskTypes, userId));
    const initialTaskTypes = [];

    // Check if the loaded data is empty or not
    if (docSnapTasks.data() != undefined) {
      const docData = docSnapTasks.data();
      for (let i = 0; i < docData.tasks.length; i++) {
        initialTasks.push(docData.tasks[i]);
      }
    } else {
      console.log("No tasks available.");
    }

    if (docSnapLocations.data() != undefined) {
      const docData = docSnapLocations.data();
      for (let i = 0; i < docData.locations.length; i++) {
        initialLocations.push(docData.locations[i]);
      }
    } else {
      console.log("No locations available.");
    }

    if (docSnapTaskTypes.data() != undefined) {
      const docData = docSnapTaskTypes.data();
      for (let i = 0; i < docData.taskTypes.length; i++) {
        initialTaskTypes.push(docData.taskTypes[i]);
      }
    } else {
      console.log("No task types available.");
    }

    // Update state with the fetched data
    setTasks(initialTasks);
    setLocations(initialLocations);
    setTaskTypes(initialTaskTypes);
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

  function MapControl() {
    const [popupPosition, setPopupPosition] = useState(null); // State to store the popup position
    const map = useMapEvents({
      click(e) {
        const clickLatLng = e.latlng;
        setPopupPosition(clickLatLng); // Set the popup position on map click
      },
    });

    const handleAddTask = () => {
      setPopupPosition(null); // Close the popup
      setModalType("task");
      setNewTask((prevTask) => ({ ...prevTask, position: popupPosition }));
      setShowModal(true);
    };

    const handleAddLocation = () => {
      setPopupPosition(null); // Close the popup
      setModalType("location");
      setNewLocation((prevLocation) => ({ ...prevLocation, position: popupPosition }));
      setShowModal(true);
    };

    return (
      <>
        {popupPosition && (
          <Popup
            position={popupPosition}
            onClose={() => setPopupPosition(null)} // Close the popup when the user clicks outside
          >
            <div>
              <button className="btn btn-primary btn-sm mb-2" onClick={handleAddTask}>
                Add Task
              </button>
              <br />
              <button className="btn btn-danger btn-sm" onClick={handleAddLocation}>
                Add Location
              </button>
            </div>
          </Popup>
        )}
      </>
    );
  }

  const newIcon = new Icon({
    iconUrl: 'https://firebasestorage.googleapis.com/v0/b/taskmap-dbac1.firebasestorage.app/o/img%2Fmarker-icon-2x.png?alt=media&token=5b6aee50-d4fd-4c57-b62d-646893ff697c',
    shadowUrl: 'https://firebasestorage.googleapis.com/v0/b/taskmap-dbac1.firebasestorage.app/o/img%2Fmarker-shadow.png?alt=media&token=51dcbc92-ff3a-4201-9c2d-5dcd6e59f5ef',
    iconSize: [25, 41],
    shadowSize: [40, 42],
    shadowAnchor: [14, 20],
    popupAnchor: [0, -20]
  })
  //  Style of the Marker elements 

  const hasLocated = useRef(false);

  const LocateUser = () => {
    const map = useMap();
    useEffect(() => {
      if (hasLocated.current) return; // Prevent re-running the logic
      hasLocated.current = true;

      // Locate the user's position and set the map view
      map.locate({ setView: true, maxZoom: 16 });
    }, []);

    return null;
  };

  return (
    <Container>

      <div className='py-3 text-center' id="welcomeImage">
        <img src='https://firebasestorage.googleapis.com/v0/b/taskmap-dbac1.firebasestorage.app/o/img%2FTaskMap.png?alt=media&token=eead2c83-b159-4c65-a9d8-7041fe967702' height='90vh'></img>
      </div>

      <MapContainer
        center={[51.06, 19.93]} // Initial map center coordinates
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
            title={task.title}
            icon={newIcon}
          >
            <Popup>
              <div>
                <strong>{task.title}</strong>
                <br />
                <span>Type: {task.type || 'N/A'}</span>
                <br />
                <span>Date: {task.date}</span>
                <br />
                <span>Time: {task.time}</span>
                <br />
                {/* Button to delete the task */}
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(500);
                    setTimeout(() => {
                      const updatedMarkers = tasks.filter((_, index) => index !== id);
                      setTasks(updatedMarkers);
                    }, 50);

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

        <MapControl />
        <LocateUser />
      </MapContainer>
      <Container className="mt-2">
        <Row className='justify-content-center'>
          <Col xs="auto">
            <LogOutButton />
          </Col>
          <Col xs="auto">
            <TaskTypesButton
              taskTypes={taskTypes}
              setTaskTypes={setTaskTypes}
            />
          </Col>
        </Row>

      </Container>

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
                <Form.Group className="mb-3" controlId="formTaskType">
                  <Form.Label>Task Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={newTask.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a task type</option>
                    {taskTypes.map((taskType, index) => (
                      <option key={index} value={taskType.title}>
                        {taskType.title}
                      </option>
                    ))}
                  </Form.Select>
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
