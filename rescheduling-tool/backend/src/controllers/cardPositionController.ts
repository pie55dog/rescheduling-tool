import { Request, Response } from "express";
import {getAuthenticatedSheet} from "../index"
import { google, sheets_v4 } from "googleapis";
import sheetConstants from "../SHEET_CONSTANTS";
import { putCardPosition } from "../services/cardPositionService";



export const handleUpdatePosition = async (req: Request, res: Response) => { //req variable will be used to extract any :perams later
  const indexesString = req.params.indexes;
  const updateValueString = req.params.newPositions;
  const indexes = indexesString.split('+').map(item => item.replace(/-.*/, ""));
  
  const updateValues = updateValueString.split('+')
  
  //basically just reformating here
  const allUpdateValuesFormated: any[] = []
  for(let i =0; i < indexes.length; i++){
    let newPosition: string[] = updateValues[i].split("") //[W, F]
    const updateValueDict: Record<string,string> = 
    {
        'W' : 'TRUE',
        'D' : 'TRUE',
        'F' : 'FALSE'
    };
    const sheetImputs = newPosition.map(encoded => updateValueDict[encoded]); //[TRUE, FALSE]
    allUpdateValuesFormated.push(sheetImputs);
    const sheetIndexes = indexes.map(item => `${sheetConstants.ISWAITLISTED_COL}${item}:${sheetConstants.ISDONE_COL}${item}`)

    

  try {
    console.log("reached the controller!");
    const valueInputOption = 'USER_ENTERED';

    const authenticatedSheet: sheets_v4.Sheets = await getAuthenticatedSheet();
    
  //need to map here indexes -> range and allUpdateValuesFormated -> values
  const data : any = sheetIndexes.map((rowIndex, i) => {

    return {
        range: rowIndex,
        values: allUpdateValuesFormated[i]
    }

  });

  

  // Additional ranges to update can be added here.

  // Create the batch update request.
  const resource = {
    data,
    valueInputOption,
  };

  // Execute the batch update request.
  const result = await putCardPosition(authenticatedSheet, resource);
  console.log("**********")
  console.log("CHANGED CARD POSITION")
  console.log(result) //returned metadata. 
  console.log("**********")

    // Log the number of updated cells.
    //res = API status 
    //result = actual sheet data found from API call

    console.log('%d cells updated.', result.data.totalUpdatedCells);
    if (!result) {
        return res.status(404).json({  //handles 404
        
        error: "request not found", 
        message: "The requested thing does not exist in the database"
        });
    }
    return res.status(200).json(result); //returns the all variable
    } catch (err:any) {
        console.log(err)
        return res.status(500).json({ //handles server errors
        error: "Internal server error 500", 
        message: "Failed to retrieve card" 
        })
    }}
}
