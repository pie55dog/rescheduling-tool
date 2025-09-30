// backend/src/googleSheetsRunner.ts
import { getSheetData } from "../services/allServices";
import { Request, Response } from "express";


export const handleGetAll = async (req: Request, res: Response) => { //req variable will be used to extract any :perams later
  try {
    console.log("reached the controller!")

    const all = await getSheetData("test!A:B");
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


