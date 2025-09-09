import { useState, useEffect } from 'react';

function App() {
  // State for storing the list of contacts fetched from the API
  const [contacts, setContacts] = useState([]);
  // State for storing any error messages
  const [error, setError] = useState(null);
  // State for the contact being updated (null for a new contact)
  const [selectedContact, setSelectedContact] = useState(null);
  // State for the form's input fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // useEffect hook to fetch contacts on initial render
  useEffect(() => {
    fetchContacts();
  }, []);

  // useEffect hook to update the form data when a contact is selected for update
  useEffect(() => {
    if (selectedContact) {
      setFormData({
        firstName: selectedContact.firstName,
        lastName: selectedContact.lastName,
        email: selectedContact.email,
        phone: selectedContact.phone
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      });
    }
  }, [selectedContact]);

  // Function to fetch contacts from the backend API
  const fetchContacts = async () => {
    try {
      const url = "http://127.0.0.1:5000/contacts";
      const response = await fetch(url);
      const data = await response.json();
      setContacts(data.contacts);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handler for form input changes, updates the formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handler for form submission (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedContact) {
        // Handle update functionality
        const url = `http://127.0.0.1:5000/update_contact/${selectedContact.id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Failed to update contact');
        }

        const updatedContact = await response.json();
        setContacts(prevContacts =>
          prevContacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact
          )
        );
        setSelectedContact(null);
        alert("Contact Updated Successfully.");
      } else {
        // Handle add new contact functionality
        const url = "http://127.0.0.1:5000/create_contact";
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to add contact');
        }
        
        const newContact = await response.json();
        setContacts(prevContacts => [...prevContacts, newContact]);
        alert("Contact Added Successfully.");
      }
      // This line is crucial for clearing the form after a successful submission.
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  // Sets the selected contact and populates the form for updating
  const handleUpdateClick = (contact) => {
    setSelectedContact(contact);
  };
  
  // Handles deleting a contact
  const handleDelete = async (id) => {
    const url = `http://127.0.0.1:5000/delete_contact/${id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        setError("Something Went Wrong! Try Again..");
      } else {
        setError(null);
        alert("Contact Deleted Successfully.");
        setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2>Contact Manager</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form for adding/updating a contact */}
      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{selectedContact ? "Update Contact" : "Add New Contact"}</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>{selectedContact ? "Update Contact" : "Add Contact"}</button>
        {selectedContact && <button type="button" onClick={() => setSelectedContact(null)} style={{ marginLeft: '10px', padding: '10px 20px' }}>Cancel Update</button>}
      </form>

      {/* Contact list table */}
      {contacts.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Full Name</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Email</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Phone</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</td>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.firstName} {contact.lastName}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.phone}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={() => handleUpdateClick(contact)} style={{ marginRight: '5px' }}>Update</button>
                  <button onClick={() => handleDelete(contact.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No contacts available</p>
      )}
    </div>
  );
}

export default App;