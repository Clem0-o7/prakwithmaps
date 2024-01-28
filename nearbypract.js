let doctors;
let selectedDoctorName;
document.addEventListener("DOMContentLoaded", function () {
    // Replace with your Firebase configuration
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
    const auth = firebase.auth();
    const database = firebase.database();

    // Create a map centered on the user's current location
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 }, // Default center
        zoom: 14 // You can adjust the zoom level as needed
    });

    // Watch the user's current location using the Geolocation API for continuous updates
    const watchId = navigator.geolocation.watchPosition(//watchstart
        position => {//start1
            const { latitude, longitude } = position.coords;

            // Log the user's coordinates to the console
            console.log('User Location Coordinates:', latitude, longitude);

            // Set the map's center to the user's current location
            map.setCenter({ lat: latitude, lng: longitude });

            // Add a marker at the user's current location with label "You are here"
            new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map: map,
                title: "You are here"
            });
        },//end1
        error => {//start2
            console.error('Error getting user location:', error);
        }//end2
    );//watch end

    // Fetch doctor addresses from Firebase
    database.ref('users/doctors/').once('value').then(snapshot => {
        const doctors = snapshot.val();

        // Iterate through doctors and add markers on the map
        Object.keys(doctors).forEach(doctorId => {
            const doctor = doctors[doctorId];

            if (doctor.address) {
                const { address, full_name } = doctor; 

                // Use Google Maps Geocoding API to get latitude and longitude based on the address
                const geocoder = new google.maps.Geocoder();

                geocoder.geocode({ address: address }, (results, status) => {
                    if (status === 'OK' && results[0].geometry) {
                        const { location } = results[0].geometry;
                        const marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            title: full_name
                        });

                        const infoWindow = new google.maps.InfoWindow({
                            content: `<strong>${full_name}</strong><br>${address}<br>`
                        });

                        marker.addListener('click', () => {
                            infoWindow.open(map, marker);
                        });
                    } else {
                        console.error('Geocoding API response does not contain valid coordinates:', status);
                    }
                });
            }
        });
    });
});

    // Clear the geolocation watch when the user leaves the page (back arrow press)
    window.addEventListener('popstate', () => {
        navigator.geolocation.clearWatch(watchId);
    });


