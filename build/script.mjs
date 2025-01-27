// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

let active = false;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let csvData = [];
let count = 0;

// DOM Elements
const usernameForm = document.getElementById("username-form");
const controls = document.getElementById("controls");
const startButton = document.getElementById("start-time");
const stopButton = document.getElementById("stop-time");

//form submission
usernameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    console.log(username);
    
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);
    console.log("result retrieved " + username);
    if (!docSnap.exists()) {
        console.log("creating user");
        //make new user
        await setDoc(docRef, {
            csv_list: [],
            fileCount: 0
        });
    } else {
        console.log("signed in");
    }
    controls.style.display = "inline";
});

// Handle Start Time
startButton.addEventListener("click", () => {
    csvData = [];
    active = true;
    startButton.style.display = "none";
    stopButton.style.display = "inline";

    // Start generating data
    interval = setInterval(() => {
        const timestamp = new Date().toISOString();
        const numericalValue = Math.random().toFixed(2) * 100; // Random number
        const status = "INACTIVE";
        if (numericalValue > 50) {
            status = "ACTIVE";
        }
        csvData.push([timestamp, numericalValue, status]);
    }, 500);
    count++;
});

// Handle Stop Time
stopButton.addEventListener("click", () => {
    active = false;
    clearInterval(interval);
    startButton.style.display = "inline";
    stopButton.style.display = "none";
    downloadCSV(csvData, "mci-mind(" + count + ")")
});

function downloadCSV(arrayOfArrays, filename) {
    // Convert array of arrays to CSV string
    const csvContent = arrayOfArrays
        .map(row => row.map(item => `"${item}"`).join(',')) // Quote each item to handle commas inside
        .join('\n'); // Join rows with newline

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a temporary download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);

    // Append the link to the body (it needs to be part of the DOM)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Remove the link after the download starts
    document.body.removeChild(link);
}