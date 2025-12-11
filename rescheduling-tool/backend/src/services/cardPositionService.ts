import path from "node:path";
import process from "node:process";
import { google, sheets_v4 } from "googleapis";
import sheetConstants from "../SHEET_CONSTANTS";
import { CardPropsBACK } from "../models/requestCard";
import { PassThrough } from "node:stream";



export async function putCardPosition(sheets: sheets_v4.Sheets, requestBodyPeram: any) { //! fix this so that it is type safe!
  const result = await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: sheetConstants.SHEET_ID,
    requestBody: requestBodyPeram, //types defined from the batchUpdate object (lol took me forever to figure out :)
  });
  return result;
  //console.log("response.data: " + JSON.stringify(response)) 

}


  