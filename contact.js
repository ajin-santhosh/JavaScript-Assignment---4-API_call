const apiURL = "https://6879269e63f24f1fdca116c7.mockapi.io/phonebook/Contact"; // declaring url globally for using multiple times
const contactBody = document.getElementById("contactBody"); // declaring tablebody globally for using in multiple fuction
const searchWarning = document.getElementById("searchWarning")
searchWarning.hidden = true // hiding search warning
const inputWarning = document.getElementById("warning")
inputWarning.hidden = true // hide input warning
// -------------------------------------------------
async function linkContact() {
  let response = await fetch(apiURL);
  const contacts = await response.json();
  getContact(contacts);
}
function getContact(contacts) {
  const contactTable = document.getElementById("contactTable");
  contactBody.innerHTML = ""; // for clearing all data form table

  try {
    contacts.forEach(listContact); // listContact will add data to table
  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem");
  }
}
function listContact(contact) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
         <td> ${contact.id}</td>
        <td> ${contact.name}</td>
        <td> ${contact.Phone}</td> 
        <td> <button class="edit" onclick = "updateContactButton('${contact.name}','${contact.Phone}','${contact.id}')"> Update </button></td> 
        <td> <button class="delete" onclick="deleteContact(${contact.id})" > Delete </button></td> 
         
        `;
  contactBody.appendChild(tr); // add data
}

async function addContact(event) {
  event.preventDefault();
  const contactName = document.getElementById("name").value.trim();
  const contactNumber = document.getElementById("phone").value.trim();
  if (!contactName || !contactNumber) {
    inputWarning.hidden =  false // show warning ...
    return;
  }
  inputWarning.hidden = true// remove warning when enter corect data
  const newContact = {
    name: contactName,
    Phone: contactNumber,
  };
  try {
    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newContact),
    });
    if (!response.ok) {
      throw new Error("Failed to add contact");
    }

    const data = await response.json(); // store added data and pass it through listContact for showing table
    listContact(data);
    alert("Contact added successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem adding the contact.");
  }
}
function updateContactButton(contactName, contactNumber, contactId) {
  // function for Update contact
  const contactForm = document.getElementById("contactForm");
  const conName = document.getElementById("name"); // getting input fields for adding name ph
  const conNumber = document.getElementById("phone");
  conName.value = contactName; // adding data to input field
  conNumber.value = contactNumber;
  const conId = contactId;
  document.getElementById("addContact").hidden = true;
  const updateButton = document.createElement("Button");
  updateButton.className = "primaryButtons";
  updateButton.textContent = "UpdateContact";
  updateButton.id = "updateButton";
  updateButton.type = "submit";
  updateButton.addEventListener("click", function (event) {
    event.preventDefault();
    updateContact(conId);
  });
  contactForm.appendChild(updateButton); // adding button
  //  console.log(contactName)
  //  console.log(contactNumber)
  //  console.log(conId)
}
async function updateContact(updateId) {
  const contactName = document.getElementById("name").value.trim();
  const contactNumber = document.getElementById("phone").value.trim();
  if (!contactName || !contactNumber) {
     inputWarning.hidden =  false // show warning ...
    return;
  }
  inputWarning.hidden = true// remove warning when enter corect data
  // console.log(contactName)
  // console.log(contactNumber)
  // console.log(contactId)
  try {
    const res = await fetch(
      `https://6879269e63f24f1fdca116c7.mockapi.io/phonebook/Contact/${updateId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactName,
          Phone: contactNumber,
        }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to Update contact");
    }

    const data = await res.json(); // store added data and pass it through listContact for showing table
    // listContact(data)
    alert("Contact update successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem updating the contact.");
  }
  linkContact();
  document.getElementById("addContact").hidden = false;
  document.getElementById("updateButton").hidden = true;
  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
}
async function deleteContact(id) {
  console.log(id);
  try {
    const response = await fetch(
      `https://6879269e63f24f1fdca116c7.mockapi.io/phonebook/Contact/${id}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
    alert("Contact deleted successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem while deleting the contact.");
  }
  linkContact();
}

async function searchContact(event){
  event.preventDefault()
  const searchText = document.getElementById("searchText").value.trim()
  if(!searchText){
         searchWarning.hidden = false
         return
  }
  searchWarning.hidden = true
  // console.log(searchText)
  try{
    let response = await fetch(apiURL);
    const contacts = await response.json();
    const results = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    )
    if (results.length > 0) {
      contactBody.innerHTML = "";  // Clear table
      results.forEach(listContact);  // Show only matched contacts
    } else {
      contactBody.innerHTML = "<tr><td colspan='5'>No contact found.</td></tr>";
    }
  }catch (error) {
    console.error("Search error:", error);
  }
}
document.getElementById("addContact").addEventListener("click", addContact);
document.getElementById("viewAllContact").addEventListener("click", linkContact);
document.getElementById("searchContact").addEventListener("click",searchContact)
