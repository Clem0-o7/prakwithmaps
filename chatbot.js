var firebaseConfig = {
  apiKey: "AIzaSyCkqU_7d_AG-xNFIomIH9nU5xUoCMwixKY",
      authDomain: "chat-veda-a949f.firebaseapp.com",
      projectId: "chat-veda-a949f",
      storageBucket: "chat-veda-a949f.appspot.com",
      messagingSenderId: "67144997114",
      appId: "1:67144997114:web:c167f240d259496aacd143",
      measurementId: "G-JQMHYHL45K"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();


let values = {
  blue: 0,
  green: 0,
  red: 0
};

function updateGraph() {
  const graphContainer = document.getElementById('graph-container');
  const bars = document.querySelectorAll('.bar');
  let totalValue = values.blue + values.green + values.red;

  let leftPosition = 0;
  bars.forEach((bar, index) => {
    const percentage = totalValue === 0 ? 0 : (values[bar.id.substring(4)] / totalValue) * 100;
    bar.style.width = `${percentage}%`;
    bar.style.left = `${leftPosition}%`;
    leftPosition += percentage;
  });
}

function increaseValue(color) {
    values[color]++;
    updateGraph();
}

function submitForm() {
  const checkboxes = document.querySelectorAll('.option:checked');
  checkboxes.forEach(checkbox => {
    const color = checkbox.getAttribute('data-color');
    increaseValue(color);
  });

  showPercentage();
  saveDoshaQuiz(); // Add this line to save the dosha quiz type
}

function showPercentage() {
    const percentageContainer = document.getElementById('percentage-container');
  percentageContainer.innerHTML = '';

  const totalValue = values.blue + values.green + values.red;
  Object.keys(values).forEach(color => {
    const percentage = totalValue === 0 ? 0 : (values[color] / totalValue) * 100;
    const colorPercentage = document.createElement('p');
    colorPercentage.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)}: ${percentage.toFixed(2)}%`;
    percentageContainer.appendChild(colorPercentage);
  });
}

// Save the final Dosha Quiz type based on percentages
function saveDoshaQuiz() {
  let totalValue = values.blue + values.green + values.red;

  // Calculate percentages
  let percentageBlue = (values.blue / totalValue) * 100;
  let percentageGreen = (values.green / totalValue) * 100;
  let percentageRed = (values.red / totalValue) * 100;

  let doshatype = "";

  // Determine dosha type based on percentages
  if (percentageBlue > percentageGreen && percentageBlue > percentageRed) {
    doshatype = "Vata";
  } else if (percentageGreen > percentageBlue && percentageGreen > percentageRed) {
    doshatype = "Pitta";
  } else if (percentageRed > percentageBlue && percentageRed > percentageGreen) {
    doshatype = "Kapha";
  } else {
    doshatype = "Balanced"; // Handle a tie or other scenarios
  }

  console.log("Dosha Quiz Type: " + doshatype);
  displayDoshaImage(doshatype); // Display the dosha image 
}

var user = firebase.auth().currentUser;
            if (user) {
                var userId = user.uid;
                database.ref('users/patients/' + userId).update({
                    doshatype: doshatype
                });
            }

// Display Dosha Image dynamically
function displayDoshaImage(doshaType) {
  const doshaImageContainer = document.getElementById('dosha-image-container');
  doshaImageContainer.innerHTML = '';

  // Placeholder URLs, replace with actual dosha images
  const doshaImageURLs = {
    Vata: 'https://cdn2.vectorstock.com/i/1000x1000/77/21/vata-dosha-ayurvedic-body-type-vector-11127721.jpg',
    Pitta: 'https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/blogs/5713/images/cMopEcakSSewzARh3bND_pitta_dosha-01.png',
    Kapha: 'https://www.urbanveda.com/gb/wp-content/uploads/2017/07/Kapha-dosha.jpg',
    Balanced: 'https://th.bing.com/th/id/OIP.W0M4UyQIQ2bztr9Or1NkggHaEo?rs=1&pid=ImgDetMain',
  };

  if (doshaImageURLs[doshaType]) {
    const doshaImage = document.createElement('img');
    doshaImage.src = doshaImageURLs[doshaType];
    doshaImage.alt = doshaType + ' Image';
    doshaImage.style.cursor = 'pointer';
    doshaImage.addEventListener('click', function() {
      alert('You clicked on the Dosha Image: ' + doshaType);
    });

    doshaImageContainer.appendChild(doshaImage);
  }
}
