const firebaseConfig = {
    apiKey: "AIzaSyCkqU_7d_AG-xNFIomIH9nU5xUoCMwixKY",
    authDomain: "chat-veda-a949f.firebaseapp.com",
    projectId: "chat-veda-a949f",
    storageBucket: "chat-veda-a949f.appspot.com",
    messagingSenderId: "67144997114",
    appId: "1:67144997114:web:c167f240d259496aacd143",
    measurementId:"G-JQMHYHL45K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the authentication service
const auth = firebase.auth();

// Logout function
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