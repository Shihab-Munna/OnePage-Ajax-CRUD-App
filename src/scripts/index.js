import '../styles/index.scss'
import axios from "axios";

const BASE_URL = "http://localhost:3000/contacts";


window.onload = function(){
    let tbody =  document.querySelector('#tbody');
   // Get data from server when pageLoad 
    axios.get(BASE_URL)
        .then(res => {
            res.data.forEach(contact => {
                createTdElement(contact, tbody)
            })
        })
        .catch(err => console.log(err))

    // add newData

    let addNewContact = document.querySelector('#addNew');
    addNewContact.addEventListener('click', function(){
        console.log("Add Button Clicked!");
        createNewContact()
    })

}

//CreateNew Contact
function createNewContact(){
    let name = document.querySelector('#name');
    let phone = document.querySelector('#phone');
    let email = document.querySelector('#email');

    let newContact = {
        name: name.value,
        phone: phone.value,
        email: email.value
    }

    axios.post(BASE_URL, newContact)
        .then(res => {
            tbody = document.querySelector('#tbody');
            createTdElement(res.data, tbody);

            name.value  = '';
            phone.value = '';
            email.value = '';
        })
        .catch(err => console.log(err))

}

//Create New Table to show

function createTdElement(contact, parentElement)
{
    const TR = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.innerHTML = contact.name;
    TR.appendChild(tdName);

    const tdPhone = document.createElement('td');
    tdPhone.innerHTML = contact.phone ? contact.phone : "N/A";
    TR.appendChild(tdPhone);

    const tdEmil = document.createElement('td');
    tdEmil.innerHTML = contact.email ? contact.email : "N/A";
    TR.appendChild(tdEmil);

    const tdActions = document.createElement('td')

    const tdEditbtn = document.createElement('button');
    tdEditbtn.className = "btn btn-outline-warning mx-1";
    tdEditbtn.innerHTML = "Edit";
    tdEditbtn.addEventListener('click', function()
    {

        let mainModal = $('#editContactModal')
        mainModal.modal('toggle')

        let nameField = document.querySelector ('#edit-name');
        let phoneField = document.querySelector('#edit-phone');
        let emailField = document.querySelector('#edit-email');

        nameField.value = contact.name;
        phoneField.value = contact.phone;
        emailField.value = contact.email;

        let saveEditbtn = document.querySelector('#saveEditBtn');

        saveEditbtn.addEventListener ('click', function(){
            let editContact = {
                name: nameField.value,
                phone: phoneField.value,
                email: emailField.value
            }

            axios.put(`${BASE_URL}/${contact.id}`, editContact)
                .then(res => {
                    tdName.innerHTML  = res.data.name;
                    tdPhone.innerHTML = res.data.phone;
                    tdEmil.innerHTML  = res.data.email;

                    window.location.reload();

                    mainModal.modal('hide');
                })
                .catch(err => console.log(err))

        })
        
    })

    tdActions.appendChild(tdEditbtn);


    const tdDeletebtn = document.createElement('button');
    tdDeletebtn.className ="btn btn-outline-danger";
    tdDeletebtn.innerHTML = "Delete";
    tdDeletebtn.addEventListener('click', function()
    {
        axios.delete(`${BASE_URL}/${contact.id}`)
            .then(
                parentElement.removeChild(TR)
            )
            .catch(err => console.log(err))
    })

    tdActions.appendChild(tdDeletebtn);
    TR.appendChild(tdActions);

    parentElement.appendChild(TR);

}



