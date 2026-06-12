import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${API_URL}/items/`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.access_token);
        setIsLoggedIn(true);
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setUsername('');
    setPassword('');
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: itemName,
          description: itemDescription,
        }),
      });
      
      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem]);
        setItemName('');
        setItemDescription('');
      } else {
        alert('Failed to create item');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      alert('Error creating item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Full Stack Demo App</h1>
        {!isLoggedIn ? (
          <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div>
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Login</button>
            </form>
          </div>
        ) : (
          <div className="main-content">
            <div className="logout-container">
              <button onClick={handleLogout}>Logout</button>
            </div>
            
            <div className="create-item-container">
              <h2>Create New Item</h2>
              <form onSubmit={handleCreateItem}>
                <div>
                  <label>Name:</label>
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <textarea
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                  />
                </div>
                <button type="submit">Create Item</button>
              </form>
            </div>
            
            <div className="items-container">
              <h2>Items</h2>
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;