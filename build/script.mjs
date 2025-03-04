// Initialize Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import dotenv from "dotenv";

dotenv.config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
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

function uploadFile(file) {
    const storage = getStorage(app);
    const storageRef = ref(storage, 'files/' + file.name);
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    }).catch((error) => {
        console.error("File upload failed: " + error);
    }).then(() => {
        console.log("File upload successful!");
    });
}