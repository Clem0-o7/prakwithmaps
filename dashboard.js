// Initialize Firebase
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
const auth = firebase.auth();
const storage = firebase.storage();
const database = firebase.database();
auth.onAuthStateChanged(function (user) {
  if (user) {
      // User is signed in
      displayUserInfo(user.uid);
  } else {
      // No user is signed in
      window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
});


function displayUserInfo(userId) {
    // Check if the user exists in the patients sub-branch
    var patientsRef = database.ref('users/patients/' + userId);
    patientsRef.once('value')
      .then(function (patientsSnapshot) {
        if (patientsSnapshot.exists()) {
          currentUserInfo = patientsSnapshot.val();
          displayUserDataOnDashboard();
        } else {
          // Check if the user exists in the doctors sub-branch
          var doctorsRef = database.ref('users/doctors/' + userId);
          doctorsRef.once('value')
            .then(function (doctorsSnapshot) {
              if (doctorsSnapshot.exists()) {
                currentUserInfo = doctorsSnapshot.val();
                displayUserDataOnDashboard();
              } else {
                // Handle the case where user data doesn't exist in either branch
                console.error('User data not found in patients or doctors branch');
              }
            })
            .catch(function (error) {
              console.error('Error retrieving user information:', error);
            });
        }
      })
      .catch(function (error) {
        console.error('Error retrieving user information:', error);
      });
  }
  function displayUserDataOnDashboard() {
    console.log(currentUserInfo);
    document.getElementById('userName').innerText += currentUserInfo.full_name;
    //document.getElementById('email').innerText += currentUserInfo.email;
    document.getElementById('userGender').innerText += currentUserInfo.gender;
    document.getElementById('userAge').innerText += currentUserInfo.age;
    document.getElementById('email').innerText += currentUserInfo.email;
    document.getElementById('rewardsEarned').innerText += currentUserInfo.credits;

    //document.getElementById('address').innerText += currentUserInfo.address;
    // Additional fields can be displayed as needed
  }
  