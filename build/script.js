// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDamj2uBYISK3Hlhdl1Y2kfdCjvK3UXZHA",
    authDomain: "mind-mci-test.firebaseapp.com",
    projectId: "mind-mci-test",
    storageBucket: "mind-mci-test.firebasestorage.app",
    messagingSenderId: "635402846686",
    appId: "1:635402846686:web:fbe92085b2864a80155d4f",
    measurementId: "G-LBJ9BT2SRV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const usernameForm = document.getElementById("username-form");
const controls = document.getElementById("controls");
const startButton = document.getElementById("start-time");
const stopButton = document.getElementById("stop-time");

// Handle form submission
usernameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    console.log(username)
    const docRef = collection(db, "users", username)
    const docSnap = await getDoc(docRef);
    console.log("result retrieved " + username)
    if (!docSnap.exists()) {
        const docRef2 = collection(db, "users")
        await setDoc(doc(docRef2, "users"), {
            csv_list: [],
            fileCount: 0
        }
    )};
});

// Handle Start Time
/*startButton.addEventListener("click", () => {
    startButton.style.display = "none";
    stopButton.style.display = "inline";

    // Start generating data
    interval = setInterval(() => {
        const timestamp = new Date().toISOString();
        const numericalValue = Math.random().toFixed(2) * 100; // Random number
        const status = active ? "ACTIVE" : "INACTIVE";
        csvData.push([timestamp, numericalValue, status]);
        active = !active; // Toggle active/inactive
    }, 500);
});

// Handle Stop Time
stopButton.addEventListener("click", () => {
    clearInterval(interval);
    stopButton.style.display = "none";

    // Generate CSV content
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], "data.csv");

    // Upload CSV to Firebase
    const storageRef = ref(storage, `csv_files/${file.name}`);
    uploadBytes(storageRef, file)
        .then(() => alert("CSV file uploaded to Firebase successfully!"))
        .catch(error => console.error("Error uploading file:", error));
});
*/