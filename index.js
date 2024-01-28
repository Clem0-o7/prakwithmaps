/*import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";*/
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkqU_7d_AG-xNFIomIH9nU5xUoCMwixKY",
        authDomain: "chat-veda-a949f.firebaseapp.com",
        projectId: "chat-veda-a949f",
        storageBucket: "chat-veda-a949f.appspot.com",
        messagingSenderId: "67144997114",
        appId: "1:67144997114:web:c167f240d259496aacd143",
        measurementId: "G-JQMHYHL45K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()



function register() {
  // Get all our input fields
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var full_name = document.getElementById('full_name').value;
  var gender = document.getElementById("gender").value;
  var age = document.getElementById("age").value;
  var occupation = document.getElementById("occupation").value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
    // Don't continue running the code
  }
  if (validate_field(full_name) == false) {
    alert('One or More Extra Fields is Outta Line!!');
    return;
  }

  // Move on with Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      // Declare user variable
      var user = auth.currentUser;

      // Add this user to Firebase Database
      var database_ref = database.ref();

      // Create User data
      var user_data = {
        email: email,
        full_name: full_name,
        gender: gender,
        age: age,
        occupation: occupation,
        last_login: Date.now(),
        credits: 50 // Set initial credits
      };

      var path = (occupation === 'doctor') ? 'doctors' : 'patients';

      // Push to Firebase Database under the determined path
      database_ref.child('users/' + path + '/' + user.uid).set(user_data);

      // Display "User Registered" message
      showRegistrationMessage();

      // Redirect to index.html after a delay (you can adjust the delay as needed)
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 2000); // 2000 milliseconds (2 seconds) delay
    })
    .catch(function (error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;
      alert(error_message);
    });
}

function grantInitialPoints(userId) {
  var userRef = database.ref('users/patients' + userId);

  // Set initial points to 50
  userRef.set({
    points: 50
  });
}
  // Get user details from the 'users/patients' node
  /*var userRef = database.ref('users/patients/' + userId);
  userRef.once('value', function (userSnapshot) {
    if (userSnapshot.exists()) {
      // Update user node with credit information
      var userData = userSnapshot.val();
      userData.credits = 50; // Set initial points

      // Update the user node with credit information
      userRef.update(userData);
    }
  });
}*/
// Function to display "User Registered" message
function showRegistrationMessage() {
  var messageContainer = document.createElement('div');
  messageContainer.innerHTML = '<h1>User Registered</h1>';
  messageContainer.setAttribute('id', 'registration_message');
  document.getElementById('content_container').appendChild(messageContainer);
}

function login() {
  // Get all our input fields
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
    // Don't continue running the code
  }

  auth.signInWithEmailAndPassword(email, password)
    .then(function () {
      // If login is successful, determine user type and redirect accordingly
      var user = auth.currentUser;

      // Check if the user exists in the patients sub-branch
      var patientsRef = database.ref('users/patients/' + user.uid);
      patientsRef.once('value', function (patientsSnapshot) {
        if (patientsSnapshot.exists()) {
          // Redirect to patient dashboard
          window.location.href = "logpatient.html";
        } else {
          // Check if the user exists in the doctors sub-branch
          var doctorsRef = database.ref('users/doctors/' + user.uid);
          doctorsRef.once('value', function (doctorsSnapshot) {
            if (doctorsSnapshot.exists()) {
              // Redirect to doctor dashboard
              window.location.href = "logdoctor.html";
            } else {
              // Handle the case where user data doesn't exist in either branch
              alert('User data not found. Please check your credentials.');
            }
          });
        }
      });
    })
    .catch(function (error) {
      // Log the error details
      console.error('Login Error:', error);

      // Display a more descriptive alert message
      alert('Login failed. Please check your email and password.');
    });
}


// Validate Functions
function validate_email(email) {
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    // Email is good
    return true
  } else {
    // Email is not good
    return false
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}