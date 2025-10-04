import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";


// The scope for doing anything 2 spreadsheets.
//TODO: make certain APIs only read, and certain read and edit.
const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), "/src/credentials.json");




// Export the authenticated sheets instance

// Export the spreadsheet ID if you want to centralize it
export const SPREADSHEET_ID = '1psBvhgyLT_rDJ1q15XmjVXiSDk6kSJ8avUgcAUz70yU'; 
//TODO: get real form-linked spreadsheed ID. Also should I hardcode this? maybe sheet imput is a feature down the line

//getter function
export async function getSheetData(sheets: sheets_v4.Sheets,range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: range,
  });
  console.log("response.data: " + JSON.stringify(response))
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return [];
  }

  const cleanedData = rows.map((row) => {
    const grade = row[0] ?? "";
    const type = row[1] ?? "";
    return { grade, type };
  });
  return cleanedData;
}