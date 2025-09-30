import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";


// The scope for doing anything 2 spreadsheets.
//TODO: make certain APIs only read, and certain read and edit.
const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), "/src/credentials.json");

console.log("reached auth")
// Initialize auth ONCE when this module is imported
async function initalizeGoogleAccount(){
    const auth = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
        });
    }


console.log("did auth")
// Export the authenticated sheets instance
export const sheets = google.sheets({ version: 'v4', auth });

// Export the spreadsheet ID if you want to centralize it
export const SPREADSHEET_ID = '1psBvhgyLT_rDJ1q15XmjVXiSDk6kSJ8avUgcAUz70yU'; //TODO: get real spreadsheed ID. Also should I hardcode this?

//getter function
export async function getSheetData(range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });
  return response.data.values;
}