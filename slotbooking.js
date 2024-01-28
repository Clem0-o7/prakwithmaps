const firebaseConfig = {
    apiKey: "AIzaSyCkqU_7d_AG-xNFIomIH9nU5xUoCMwixKY",
        authDomain: "chat-veda-a949f.firebaseapp.com",
        projectId: "chat-veda-a949f",
        storageBucket: "chat-veda-a949f.appspot.com",
        messagingSenderId: "67144997114",
        appId: "1:67144997114:web:c167f240d259496aacd143",
        measurementId:"G-JQMHYHL45K"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();



function populateDoctorOptions() {
    const doctorsSelect = document.getElementById("preferredDoctor");

    // Reference to the "users" node in the database
    const usersRef = database.ref('users/doctors');

    // Fetch doctors' names
    usersRef.orderByChild('occupation').equalTo('doctor').once('value')
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                const doctorName = childSnapshot.val().full_name;
                const option = document.createElement("option");
                option.value = doctorName;
                option.text = doctorName;
                doctorsSelect.appendChild(option);
            });
        })
        .catch(function (error) {
            console.error('Error retrieving doctor names:', error);
        });
}

// Call the function to populate doctor options
populateDoctorOptions();

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("slotBookingForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form data
        const patientName = document.getElementById("patientName").value;
        const date = document.getElementById("appointmentDate").value;
        const time = document.getElementById("appointmentTime").value;
        const serviceType = document.getElementById("appointmentType").value;
        const doctorName = document.getElementById("preferredDoctor").value;
        const username = document.getElementById("username").value;
        const mode = document.getElementById("mode").value;

        // Validate the data (you can add your own validation logic here)
        const currentDate = new Date();
        const selectedDate = new Date(date + " " + time);
        
        if (selectedDate <= currentDate) {
            alert("Please select a future date and time.");
            return;
        }

        // Validate the time
        const selectedTime = selectedDate.getHours();
        if (selectedTime < 9 || selectedTime >= 20) {
            alert("Please select a time between 9 am and 8 pm.");
            return;
        }

        // Create a reference to the "appointments" node in your database
        const appointmentsRef = database.ref("appointments");

        // Push the data to the database
        const newAppointmentRef = appointmentsRef.push({
            name: patientName,
            date: date,
            time: time,
            serviceType: serviceType,
            doctorName: doctorName,
            username: username,
            mode: mode,
        });

        // Retrieve the key of the newly added appointment
        var user = firebase.auth().currentUser;
            if (user) {
                var userId = user.uid;
                database.ref('users/patients/' + userId).update({
                    credits: userId.credits+50
                });
            }

        // Reset the form
        form.reset();

        alert("Slot booked successfully! Your credits have been updated.");
    });
});