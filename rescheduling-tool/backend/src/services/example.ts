// backend/src/services/googleSheets.ts

import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";

// The scope for reading spreadsheets.
const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), "credentials.json");

// old pathe:  https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 
/**
 * Fetches the names and majors of students from a sample spreadsheet.
 * @see https://docs.google.com/spreadsheets/d/1psBvhgyLT_rDJ1q15XmjVXiSDk6kSJ8avUgcAUz70yU/edit?gid=0#gid=0
 */
export async function listMajors(): Promise<Array<{ name: string; major: string }>> {
  // Authenticate with Google and get an authorized client.
  console.log("reached authetication")
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  // Create a new Sheets API client.
  const sheets: sheets_v4.Sheets = google.sheets({ version: "v4", auth });

  // Get the values from the spreadsheet.
  console.log("reached spreadhseed")
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: "1psBvhgyLT_rDJ1q15XmjVXiSDk6kSJ8avUgcAUz70yU",
    range: "test!A:B",
  });

  const rows = result.data.values;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return [];
  }

  console.log("Name, Major:");
  const majors = rows.map((row) => {
    const name = row[0] ?? "";
    const major = row[1] ?? "";
    console.log(`${name}, ${major}`);
    return { name, major };
  });

  return majors;
}


