import { useState } from 'react';
import { Button, Form, Modal, ListGroup } from 'react-bootstrap';

function TaskTypesButton({ taskTypes, setTaskTypes }) {
  const [isModalVisible, setIsModalVisible] = useState(false); // To toggle modal visibility
  const [isViewingList, setIsViewingList] = useState(false); // To toggle between add and view modes
  const [taskType, setTaskType] = useState({
    title: "",
  });

  const handleEditTaskTypes = () => {
    setIsModalVisible(true); // Show the modal when clicked
    setIsViewingList(false); // Default to add mode
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskType((prevTaskType) => ({ ...prevTaskType, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the new task type to the taskTypes array
    setTaskTypes((prevTaskTypes) => [...prevTaskTypes, taskType]);

    // Reset the form and hide the modal
    setTaskType({ title: ""});
    setIsModalVisible(false);
  };

  const handleDelete = (index) => {
    // Remove the task type at the specified index
    setTaskTypes((prevTaskTypes) =>
      prevTaskTypes.filter((_, i) => i !== index)
    );
  };

  const handleClose = () => {
    setIsModalVisible(false); // Close the modal
  };

  return (
    <>
      <Button onClick={handleEditTaskTypes}>Edit Task Types</Button>

      {/* Modal for the form */}
      <Modal show={isModalVisible} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isViewingList ? "Task Types List" : "Add New Task Type"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isViewingList ? (
            // Display the list of task types
            <ListGroup>
              {taskTypes.length > 0 ? (
                taskTypes.map((taskType, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{taskType.title}</strong>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </ListGroup.Item>
                ))
              ) : (
                <p>No task types available.</p>
              )}
            </ListGroup>
          ) : (
            // Display the form for adding a new task type
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={taskType.title}
                  onChange={handleInputChange}
                  placeholder="Enter title"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Save
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!isViewingList && (
            <Button
              variant="secondary"
              onClick={() => setIsViewingList(true)} // Switch to view mode
            >
              View Task Types
            </Button>
          )}
          {isViewingList && (
            <Button
              variant="secondary"
              onClick={() => setIsViewingList(false)} // Switch to add mode
            >
              Add New Task Type
            </Button>
          )}
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskTypesButton;