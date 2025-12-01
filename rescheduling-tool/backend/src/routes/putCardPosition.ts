import express from "express";
import {handleUpdatePosition} from "../controllers/cardPositionController"



const router = express.Router();

// Mounting the controller here instead of calling db directly

console.log("reached the router! saving position/status changes!")
router.get("/:indexes/:newPositions", handleUpdatePosition); 

//indexes will be a list like
// 1+9-12+10+98
//of cards that have been updated. cards with multiple rquests will have a dash in the middle
//and between cards will be a +

//new position will be an expression of the new status of the 
//isWaitlisted(W/F)
//isDone(D/F)

//so it will look like
//WD+FF+FD ect. 

//* an example API call
//* /saveAllPositions/21+91-102+88/WF+WD+FD


//? The reason why this is just a "/" is because it is predefined that this is
//? what comes after the /getsomeAB
//router.get("/aSecondRequest/:peram", handleGetAll); //grace this is how you do :perams :) 

export default router;