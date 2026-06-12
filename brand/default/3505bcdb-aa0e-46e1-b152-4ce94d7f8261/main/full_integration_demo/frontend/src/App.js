import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Fetch all items
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Create a new item
  const createItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/items`, { name, description });
      setName('');
      setDescription('');
      fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  // Update an item
  const updateItem = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/items/${editingId}`, {
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
      setEditName('');
      setEditDescription('');
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Start editing an item
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  // Load items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Integration Demo</h1>
        <p>React frontend with FastAPI backend and PostgreSQL database</p>
      </header>

      <main>
        <section className="create-item">
          <h2>Create New Item</h2>
          <form onSubmit={createItem}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit">Create Item</button>
          </form>
        </section>

        <section className="items-list">
          <h2>Items</h2>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  {editingId === item.id ? (
                    <form onSubmit={updateItem}>
                      <div>
                        <label htmlFor={`edit-name-${item.id}`}>Name:</label>
                        <input
                          type="text"
                          id={`edit-name-${item.id}`}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`edit-description-${item.id}`}>Description:</label>
                        <textarea
                          id={`edit-description-${item.id}`}
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </div>
                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEditing}>Cancel</button>
                    </form>
                  ) : (
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                      <p><small>Created: {new Date(item.created_at).toLocaleString()}</small></p>
                      <button onClick={() => startEditing(item)}>Edit</button>
                      <button onClick={() => deleteItem(item.id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;