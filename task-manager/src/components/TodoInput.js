import React, { useState } from "react";
import './style.css';
import { useDispatch } from "react-redux";
import { addItem } from './CartSlice';
import styled from "styled-components";

// Styled components
const Container = styled.div`
  max-width: 500px;
  margin: 80px auto;
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #1976d2;
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #1565c0;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
`;

const TodoInput = () => {

    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "",
        priority: "",
        dueDate: ""
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim() === "" || formData.description.trim() === "") {
            setError("Title and Description are required.");
            setTimeout(() => setError(null), 3000);
            return;
        }
        const tempTask = {
            task_id: Date.now(), // temporary id
            title: formData.title,
            description: formData.description,
            status: formData.status || "Pending",
            priority: formData.priority || "Medium",
            createdDate: new Date().toISOString(),
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
        };
        dispatch(addItem(tempTask));
        setFormData({
            title: "",
            description: "",
            status: "",
            priority: "",
            dueDate: ""
        });
        setError(null);
    };

return (
    <Container>
      <Title>To-Do List</Title>
      <StyledForm onSubmit={handleSubmit}>
        <Input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
        <Select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </Select>
        <Input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
        <Button type="submit">Add Task</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </StyledForm>
    </Container>
  );
};

export default TodoInput;