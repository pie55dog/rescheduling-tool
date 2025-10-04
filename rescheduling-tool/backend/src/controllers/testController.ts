// backend/src/googleSheetsRunner.ts

//? THIS IS MIDDLE WEAR


import { getSheetData } from "../services/cardServices";
import { Request, Response } from "express";
import {getAuthenticatedSheet} from "../index"
import { google, sheets_v4 } from "googleapis";

export const handleGetAll = async (req: Request, res: Response) => { //req variable will be used to extract any :perams later
  try {
    console.log("reached the controller!")
    const authenticatedSheet: sheets_v4.Sheets = await getAuthenticatedSheet();
    const all = await getSheetData(authenticatedSheet, "test!A:B");
    console.log("result from getSheetData: " + all)
    if (!all) {
      return res.status(404).json({  //handles 404
        
        error: "Thing not found", 
        message: "The requested thing does not exist in the database"
      });
    }
    return res.status(200).json(all); //returns the all variable
  } catch (err:any) {
      console.log(err)
      return res.status(500).json({ //handles server errors
        error: "Internal server error 500", 
        message: "Failed to retrieve majors" 
      })
  }
}


