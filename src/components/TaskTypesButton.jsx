import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

function TaskTypesButton({ taskTypes, setTaskTypes }) {
  const [isModalVisible, setIsModalVisible] = useState(false); // To toggle modal visibility
  const [taskType, setTaskType] = useState({
    title: "",
    color: "",
  });

  const handleEditTaskTypes = () => {
    setIsModalVisible(true); // Show the modal when clicked
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
    setTaskType({ title: "", color: "" });
    setIsModalVisible(false);
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
          <Modal.Title>Edit Task Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

            <Form.Group controlId="formColor" className="mt-3">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={taskType.color}
                onChange={handleInputChange}
                placeholder="Enter color"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TaskTypesButton;