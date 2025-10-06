import express, { Request, Response } from 'express';
import path from "node:path";
import getAllRoute from './routes/getAllRoute'
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";

const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
const CREDENTIALS_PATH: string = path.join(process.cwd(), "/src/credentials.json");

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

async function initializeGoogleAccount(){
    const auth = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    return sheets;
}

let authenticatedSheet: sheets_v4.Sheets;

export function getAuthenticatedSheet(){
  return authenticatedSheet;
}

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// MOUNTING ALL ROUTES TO SERVER
app.use("/getCardInformation", getAllRoute)

// Start server AFTER authentication completes
async function startServer() {
  try {
    console.log("Authenticating with Google...");
    authenticatedSheet = await initializeGoogleAccount();
    console.log("Authentication successful!");
    
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize:", error);
    process.exit(1);
  }
}

startServer();

export default app;