from flask import current_app as app, jsonify, request, json
from models.model import Contact, db


@app.route("/contacts", methods =["GET"])
def contacts():
    result = Contact.query.all()
    contacts = [{"id": contact.id, "firstName": contact.firstname, "lastName": contact.lastname,
                "email": contact.email, "phone": contact.phone} for contact in result]
    
    return (jsonify({"contacts": contacts}), 200)
   

@app.route("/create_contact", methods = ["POST"])
def create_contact():
    firstname = request.json.get("firstName")
    lastname = request.json.get("lastName")
    email = request.json.get("email")
    phone = request.json.get("phone")

    existing_contact = Contact.query.filter(Contact.phone == phone).first()

    if existing_contact:
        return (jsonify({"message":"Contact Already Exits."}), 409)

    try:
        new_contact = Contact(firstname= firstname, lastname= lastname, email= email, phone= phone)
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return (jsonify({"message": e}), 500)
    
    return (jsonify({"messagae":"Contact Added Successfully."}), 201)


@app.route("/update_contact", methods = ["POST"])
def update_contact():
    firstname = request.json.get("firstName")
    lastname = request.json.get("lastName")
    email = request.json.get("email")
    phone = request.json.get("phone")
    id = request.json.get("id")

    contact = Contact.query.filter(Contact.id == id).first()

    try:
        contact.firstname = firstname
        contact.lastname = lastname
        contact.email = email
        contact.phone = phone
    except Exception as e:
        return (jsonify({"message": e}), 400)

    return (jsonify({"message": "Contact Update Successfully."}), 200)
    


@app.route("/delete_contact/<int:id>")
def delete_contact(id):
    contact = Contact.query.get(id)

    if not contact:
        return (jsonify({"message": "Contact Not Found."}), 400)
    
    try:
        db.session.delete(contact)
        db.session.commit()

    except Exception as e:
        db.session.rollback()
        return (jsonify({"message": e}), 404)

    return (jsonify({"message": "Contact Deleted Successfully"}), 200)

    
