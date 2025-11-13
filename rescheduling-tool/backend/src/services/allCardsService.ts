import path from "node:path";
import process from "node:process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";
import sheetConstants from "../SHEET_CONSTANTS";
import { CardPropsBACK } from "../models/requestCard";
import { PassThrough } from "node:stream";

// The scope for doing anything 2 spreadsheets.
//TODO: make certain APIs only read, and certain read and edit. can do this by modifying the SCOPES link below
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
  //TODO: this is no longer useful????
    //* WORKING RN!!
  //check if spreadsheet is empty
  const rows : any[][] | null | undefined = response.data.values;
  if (!rows || rows.length === 0) {
    console.log("spreadsheet seems empty. Contact grabish@nuevaschool.org");
    return [];
  }
  //map rows and columns 
  const numRows : number = rows.length; //? could this throw an error if rows does not exist? Though we did clear that above. good test ig
  const columnNames = rows[0]
  
  const To_Do : Array<CardPropsBACK> = []
  const Waitlist : Array<CardPropsBACK> = []
  const Done : Array<CardPropsBACK> = []
  const AllCards : Array<CardPropsBACK> = []


      //will sort through each row, and put an array into either a waitlist, to do, or complete based on booleans in last row.
    // the array will represent a card. it will have [indexes: SHEET_LOCATIONS, student email: STUDENT_EMAIL] student email should ALWAYS be the first column
    // when it encounters a row, it will search the list of existing cards to see if that student email is already in one of them
    // if it is, then the program will add the index of the row to the student's card
    // if it is not, then the program will create a new card.
    //will return three lists to CardView element: to do, wiatlist, done

  console.log("row 0: " + rows[0]);
  console.log("columb names: " + columnNames)
  
  function getCards(){
    if (!rows) return;
    for (let i = 1; i < numRows; i++) {
      let isProcessed: boolean = false;
      let row = rows[i]; //i = 1 to start because we want to skip the header row.
      let email = row[0];
      let isDone = row[row.length -1] === "TRUE"; //this is here because typescript actually does not protect types at runtime
      let isWaitlisted = row[row.length -2] === "TRUE"; //because google sheets api just returns strings, we have to convert to boolean again.
      //search for student email
      for (let c = 0; c < AllCards.length; c ++) {
        if (AllCards[c].studentEmail == email){
          AllCards[c].index.push(i);
          isProcessed = true
        }
      }
      //only runs if function has not found email
      if (isProcessed == false) {
        AllCards.push({
        studentEmail: email,
        index: [i],
        isWaitlisted: isWaitlisted,
        isDone: isDone,
      })
     }
    }
    
  }

  function sortCards(){
    for (let c =0; c < AllCards.length; c++){
      let myCar = true;
      console.log("card " + c + ": isWaitlisted: " + AllCards[c].isWaitlisted + "»»»»» isDone: " + AllCards[c].isDone);
      console.log("my car = " + myCar)
      if (AllCards[c].isDone === true) {Done.push(AllCards[c])}
      else if (AllCards[c].isWaitlisted === true) {Waitlist.push(AllCards[c])}
      else if (AllCards[c].isWaitlisted === false) {To_Do.push(AllCards[c])}
      else (null) //TODO: how to make this fail loudly? 
    }
  }

  
  getCards();
  sortCards();
  return { Done, Waitlist, To_Do, AllCards };

}
 