// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
const yaml = require('js-yaml');

const config = yaml.load(fs.readFileSync('apphosting.yaml', 'utf8'));
const cfg = config.firebase;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase

  const app = initializeApp(cfg);
  const db = getFirestore(app);
  const auth = getAuth(app);

export { db, auth }
