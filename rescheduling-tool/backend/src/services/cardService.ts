import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";
import sheetConstants from "../SHEET_CONSTANTS";

// The scope for doing anything 2 spreadsheets.
//TODO: make certain APIs only read, and certain read and edit.
const SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
// The path to the credentials file.
const CREDENTIALS_PATH: string = path.join(process.cwd(), "/src/credentials.json");

const SHEET_ID: string = sheetConstants.SHEET_ID;



//TODO: get real form-linked spreadsheed ID. Also should I hardcode this? maybe sheet imput is a feature down the line

//getter function
export async function getSheetData(sheets: sheets_v4.Sheets,range: string) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: range,
  });
  console.log("response.data: " + JSON.stringify(response))
  

  //?should this go in the controller? since the conrtoller handles what happens between service and front end
  //TODO: make this return an actually useful card schema
  //check if spreadsheet is empty
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log("spreadsheet seems empty. Contact grabish@nuevaschool.org");
    return [];
  }
  const cleanedData = rows.map((row) => {
    const grade = row[0] ?? "";
    const type = row[1] ?? "";
    return { grade, type };
  });
  return cleanedData;
}