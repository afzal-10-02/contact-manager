import { useState, useEffect } from 'react'
import App from './App'

function ContactForm({ }) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")



    const handleCreate = async(e) => {
        e.preventDefault();

        const contactData = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone
        };
        console.log(contactData)
        const url = `http://127.0.0.1:5000/create_contact`

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        }

        const response = await fetch(url, options)
        if (response.status !== 201 && response.status !== 200){
            const data =await response.json()
            alert(data.message)
        }else{
            alert("Successfully Added Contact.")
            setFirstName("")
            setLastName("")
            setEmail("")
            setPhone("")
        }
    }
    
    return (
        <>
            <h2>Create Contact</h2>
            <form onSubmit={handleCreate}>
                <div>
                    <label>First Name:</label><br />
                    <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Last Name:</label><br />
                    <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Phone:</label><br />
                    <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save Contact</button>
            </form>
        </>
    );
}

export default ContactForm