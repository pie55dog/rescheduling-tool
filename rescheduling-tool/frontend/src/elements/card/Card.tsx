import {useState, useEffect} from "react";
import axios from 'axios';


export default function Card(){
    const [cardContent, setCardContent] = useState <string> ("loading.."); //setCardContent is the setter for the const
        useEffect(() => {
            async function getStuff () {
                try{
                    const stuff = await axios.get("http://localhost:5000/getsomeAB");
                    console.log(stuff);
                    setCardContent(JSON.stringify(stuff))
                }catch (error){
                    console.error("Error: ", error);
                    setCardContent("There was an error! Please refer to the console.")
                }
            }
        getStuff()
        }
        
    ,[]); //this empty array means RUN ON STARTUP!

    return <div>
        <p>{cardContent}</p>
    </div>
}