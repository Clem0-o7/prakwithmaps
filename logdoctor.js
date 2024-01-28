document.addEventListener("DOMContentLoaded", function () {
    // Your Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCkqU_7d_AG-xNFIomIH9nU5xUoCMwixKY",
        authDomain: "chat-veda-a949f.firebaseapp.com",
        projectId: "chat-veda-a949f",
        storageBucket: "chat-veda-a949f.appspot.com",
        messagingSenderId: "67144997114",
        appId: "1:67144997114:web:c167f240d259496aacd143",
        measurementId: "G-JQMHYHL45K"
    };

    firebase.initializeApp(firebaseConfig);

    // Initialize variables
    const auth = firebase.auth();
    const database = firebase.database();

    let currentUserInfo;

    // Check if the user is logged in
    auth.onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            getUserInfo(user.uid);
            displayAppointments();
        } else {
            // No user is signed in
            window.location.href = 'index.html'; // Redirect to login page if not logged in
        }
    });

    function getUserInfo(userId) {
        var userRef = database.ref('users/doctors/' + userId);

        userRef.once('value')
            .then(function (snapshot) {
                currentUserInfo = snapshot.val();
                console.log(currentUserInfo);
            })
            .catch(function (error) {
                console.error('Error retrieving user information:', error);
            });
    }

    function displayAppointments() {
        const appointmentsRef = database.ref("appointments");
    
        // Retrieve all appointments
        appointmentsRef.once('value')
            .then(function (snapshot) {
                const appointmentsContainer = document.getElementById('bookedSlotsContainer');
    
                // Clear existing content
                appointmentsContainer.innerHTML = '';
    
                snapshot.forEach(function (childSnapshot) {
                    const appointmentData = childSnapshot.val();
                    if (appointmentData.doctorName === currentUserInfo.full_name) {
                        // Create a table row for each appointment
                        const appointmentRow = document.createElement('tr');
    
                        // Populate the row with appointment details
                        appointmentRow.innerHTML = `
                            <td>${appointmentData.name}</td>
                            <td>${appointmentData.date}</td>
                            <td>${appointmentData.time}</td>
                            <td>${appointmentData.serviceType}</td>
                            <td>${appointmentData.mode}</td>
                            <td><button class="viewButton"> View</button></td>
                            <td><button class="acceptButton"> Accept</button>
                            <button class="declineButton"> Decline</button></td>
                        `;
    
                        // Append the row to the table
                        appointmentsContainer.appendChild(appointmentRow);
                        const viewButton = appointmentRow.querySelector('.viewButton');
viewButton.classList.add('styledViewButton');
                       
                        viewButton.addEventListener('click', function () {
                            // Call a function to handle opening the report pop-up
                            openReportPopup(childSnapshot.key, appointmentData.username);
                        });
                        const acceptButton = appointmentRow.querySelector('.acceptButton');
                        acceptButton.addEventListener('click', function () {
                            // Call a function to handle accepting the appointment
                            acceptAppointment(childSnapshot.key);
                        });
    
                        const declineButton = appointmentRow.querySelector('.declineButton');
                        declineButton.addEventListener('click', function () {
                            // Call a function to handle declining the appointment
                            declineAppointment(childSnapshot.key);
                        });
                    }
                });
            })
            .catch(function (error) {
                console.error('Error retrieving appointments:', error);
            });
    }
    function acceptAppointment(appointmentKey) {
    // Implement the logic for accepting the appointment
    console.log('Appointment accepted:', appointmentKey);
}

function declineAppointment(appointmentKey) {
    // Implement the logic for declining the appointment
    console.log('Appointment declined:', appointmentKey);
}
    function openReportPopup(appointmentKey, patientUsername) {
        const modal = document.getElementById('myModal');
        const modalContent = document.getElementById('modalContent');
    
        // Check if patient's username matches any full_name in users/patients
        const patientsRef = database.ref("users/patients");
        patientsRef.once('value')
            .then(function (snapshot) {
                snapshot.forEach(function (patientSnapshot) {
                    const patientData = patientSnapshot.val();
                    if (patientData.full_name === patientUsername) {
                        // Display the patient's full_name in the modal
                        modalContent.innerHTML = `<p><strong>Patient's Full Name:</strong> ${patientData.full_name}</p> <p><strong>Patient's Age:</strong> ${patientData.age}</p> <p><strong>Patient's email:</strong> ${patientData.email}</p> <p><strong>Patient's Gender:</strong> ${patientData.gender}</p> 
                         <p><strong>Patient's doshatype:</strong> ${patientData.doshatype}</p>`
                        
                        
                        // Display the modal
                        modal.style.display = 'block';
                        return; // Exit the loop since we found a match
                    }
                });
            })
            .catch(function (error) {
                console.error('Error retrieving patients:', error);
            });
    
        // Add event listener to close the modal when clicking the close button (×)
        const closeButton = document.getElementById('closeButton');
        closeButton.onclick = function () {
            modal.style.display = 'none';
        };
    
        // Close the modal if the user clicks outside of it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    }
    function logout() {
        auth.signOut().then(() => {
            // Redirect to index.html after successful logout
            window.location.href = "index.html";
        }).catch((error) => {
            console.error("Error during logout:", error);
        });
    }

    // Attach the logout function to the logout button click event
    document.querySelector('.logout').addEventListener('click', logout);
});


