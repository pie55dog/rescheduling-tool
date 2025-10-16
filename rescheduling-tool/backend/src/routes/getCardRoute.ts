import express from "express";
import {handleGetOneChange} from "../controllers/oneCardController"



const router = express.Router();

// Mounting the controller here instead of calling db directly

console.log("reached the router!")
router.get("/:index", handleGetOneChange); 
//? The reason why this is just a "/" is because it is predefined that this is
//? what comes after the /getsomeAB
//router.get("/aSecondRequest/:peram", handleGetAll); //grace this is how you do :perams :) 

export default router;