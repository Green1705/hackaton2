const firebaseConfig = {
  apiKey: "AIzaSyBsL_N24_G_vIdaJr5GTPQMzpTtD3Woetg",
  authDomain: "cassinihakaton.firebaseapp.com",
  databaseURL: "https://cassinihakaton-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "cassinihakaton",
  storageBucket: "cassinihakaton.firebasestorage.app",
  messagingSenderId: "262843851908",
  appId: "1:262843851908:web:6c4110bc00fb5f44ef8ed1",
  measurementId: "G-S2K08DVGBM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let map;
let myUserId;
const userMarkers = {};
let directionsService = null;
let directionsRenderer = null;

function initMap() {
  // Use the correct map container
  const mapDiv = document.getElementById("googleMap");
  if (!mapDiv) return;

  // Prompt for user ID
  myUserId = prompt("Enter your user ID (e.g., user1 or user2):", "user1");
  if (!myUserId) {
    alert("User ID is required!");
    return;
  }

  // Add a button to delete a user
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete a User";
  deleteBtn.style.position = "absolute";
  deleteBtn.style.top = "10px";
  deleteBtn.style.right = "10px";
  deleteBtn.style.zIndex = 1000;
  document.body.appendChild(deleteBtn);

  deleteBtn.onclick = function() {
    const userToDelete = prompt("Enter the user ID to delete:");
    if (userToDelete) {
      db.ref("users/" + userToDelete).remove().then(() => {
        alert("User '" + userToDelete + "' deleted.");
      }).catch((err) => {
        alert("Error deleting user: " + err.message);
      });
    }
  };

  // Check if user exists, if not, create a new one
  db.ref("users/" + myUserId).once("value", (snapshot) => {
    if (!snapshot.exists()) {
      db.ref("users/" + myUserId).set({ lat: null, lng: null });
    }
  });

  const defaultLocation = { lat: 42.00544, lng: 21.41031 };
  map = new google.maps.Map(mapDiv, {
    center: defaultLocation,
    zoom: 13,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  directionsRenderer.setMap(map);

  // Listen for all users' locations and update/add markers in real time
  db.ref("users").on("value", (snapshot) => {
    const users = snapshot.val();
    if (!users) return;
    Object.keys(users).forEach((userId) => {
      const pos = users[userId];
      if (pos && pos.lat !== null && pos.lng !== null) {
        if (!userMarkers[userId]) {
          userMarkers[userId] = new google.maps.Marker({
            map,
            position: pos,
            icon: {
              url: "https://ui-avatars.com/api/?background=2a9d8f&color=fff&name=" + encodeURIComponent(userId) + "&rounded=true&size=64",
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            },
            title: userId,
          });
        }
        userMarkers[userId].setPosition(pos);
      }
    });

    // Directions and walking time between two users (if at least two exist)
    const userIds = Object.keys(users).filter(uid => users[uid].lat !== null && users[uid].lng !== null);
    if (userIds.length >= 2) {
      const [userA, userB] = userIds;
      const origin = users[userA];
      const destination = users[userB];

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (result, status) => {
          let infoDiv = document.getElementById("walking-info");
          if (status === "OK") {
            directionsRenderer.setDirections(result);
            const duration = result.routes[0].legs[0].duration.text;

            // Update ETA in the modal
            const etaElem = document.querySelector('.status-info p:last-child');
            if (etaElem) {
              etaElem.textContent = `ETA: ${duration}`;
            }

            if (!infoDiv) {
              infoDiv = document.createElement("div");
              infoDiv.id = "walking-info";
              // document.body.appendChild(infoDiv);
            }
            infoDiv.textContent = `Walking time between ${userA} and ${userB}: ${duration}`;
          } else {
            directionsRenderer.setDirections({ routes: [] });
            if (infoDiv) infoDiv.textContent = "No walking route found.";
            // Update ETA to unknown
            const etaElem = document.querySelector('.status-info p:last-child');
            if (etaElem) {
              etaElem.textContent = `ETA: --`;
            }
          }
        }
      );
    } else {
      directionsRenderer.setDirections({ routes: [] });
      let infoDiv = document.getElementById("walking-info");
      if (infoDiv) infoDiv.textContent = "Need at least 2 users for directions.";
      // Update ETA to unknown
      const etaElem = document.querySelector('.status-info p:last-child');
      if (etaElem) {
        etaElem.textContent = `ETA: --`;
      }
    }

    // Remove markers for users that no longer exist
    Object.keys(userMarkers).forEach((userId) => {
      if (!users[userId] || users[userId].lat === null || users[userId].lng === null) {
        userMarkers[userId].setMap(null);
        delete userMarkers[userId];
      }
    });
  });

  // Start location tracking
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const myPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      if (userMarkers[myUserId]) {
        userMarkers[myUserId].setPosition(myPos);
        map.setCenter(myPos);
      }
      db.ref("users/" + myUserId).set(myPos);
    });
  }
}
window.initMap = initMap;