// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AlzaSyDhZgzuNx004Yd6L_AFq0aMG9TarC1R8BY",
  authDomain: "allora-1266f.firebaseapp.com",
  projectId: "allora-1266f",
  storageBucket: "allora-1266f.appspot.com",
  messagingSenderId: "547196680494",
  appId: "1:547196680494:android:0a6ccc076fe9466e7de2bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Main function to handle routing
const main = async () => {
  const content = document.getElementById("content");
  const hash = window.location.hash;

  if (!hash) {
    // Show the list of orders
    content.innerHTML = "<ul id='orders-list'></ul>";
    await fetchOrders();
  } else {
    // Show the details of a specific order
    const orderId = hash.substring(1); // Remove the '#' from the hash
    await fetchOrderDetails(orderId);
  }
};

// Fetch and display the list of orders
const fetchOrders = async () => {
  const ordersList = document.getElementById("orders-list");
  const querySnapshot = await getDocs(collection(db, "orders"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#${doc.id}">
        ${data.restaurantName} - ${data.selectedDishes.map(dish => dish.name).join(", ")}
      </a>
    `;
    ordersList.appendChild(li);
  });
};

// Fetch and display the details of a single order
const fetchOrderDetails = async (orderId) => {
  const content = document.getElementById("content");
  const orderDoc = await getDoc(doc(db, "orders", orderId));

  if (orderDoc.exists()) {
    const data = orderDoc.data();
    const dishes = data.selectedDishes
      .map(
        (dish) =>
          `<li><strong>Dish:</strong> ${dish.name} - $${dish.price} <strong>Restrictions:</strong> ${
            dish.restrictions?.length ? dish.restrictions.join(", ") : "None"
          }</li>`
      )
      .join("");

    const userRestrictions = data.userRestrictions?.length
      ? data.userRestrictions.join(", ")
      : "None";

    content.innerHTML = `
      <h2>Order Details</h2>
      <p><strong>Restaurant:</strong> ${data.restaurantName}</p>
      <ul>${dishes}</ul>
      <p><strong>User Restrictions:</strong> ${userRestrictions}</p>
      <p><strong>User Email:</strong> ${data.userEmail}</p>
      <button onclick="window.location.href='https://magalhaes24.github.io/allora';">Back to Orders List</button>
    `;
  } else {
    content.innerHTML = `
      <p>Order not found. <button onclick="window.location.href='https://magalhaes24.github.io/allora';">Back to Orders List</button></p>
    `;
  }
};

// Listen for hash changes
window.addEventListener("hashchange", main);

// Initial load
main();
