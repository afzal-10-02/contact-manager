import { useState, useEffect } from 'react'


function App() {
  const [contacts, setContacts] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const url = "http://127.0.0.1:5000/contacts"
      const response = await fetch(url);
      const data = await response.json();
      setContacts(data.contacts);
      console.log(data.contacts);

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async(id) => {
    const url = `http://127.0.0.1:5000//delete_contact/${id}`
    try {
      const response = await fetch(url)
      
      if (!response.ok){
        setError("Something Went Wrong! Try Again..")
      }
      else{
          setError(null)
          alert("Contact Deleted Successsfully.")
          setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      }
    }
    catch (err){
      setError(err.message)
    }

  };
  
  const handleUpdate = (id) =>{
    alert(`hello world ${id}`)
  }

  return (
    <>
      <h2>Contact List</h2>

      {contacts.length > 0 ? (
        <table>
          <thead>
            <tr>
              <td>Full Name</td>
              <td>Email</td>
              <td>Phone</td></tr>
          </thead>
          {contacts.map((contact) => (
            <tbody>
              <tr key={contact.id}>
                <td>{contact.firstName} {contact.lastName}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                <td><button onClick={() => handleUpdate(contact.id)}>Update</button>
                <button onClick={() => handleDelete(contact.id)}>Delete</button></td>
              </tr>
            </tbody>

          ))}
        </table>
      ) : (
        <p>No contacts available</p>
      )}

    </>
  );
}

export default App