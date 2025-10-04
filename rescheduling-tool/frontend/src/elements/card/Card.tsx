import {useState, useEffect} from "react";
import axios from 'axios';


export default function Card(index: number){
    const [cardContent, setCardContent] = useState <string> ("loading.."); //setCardContent is the setter for the const
        useEffect(() => {
            async function getStuff () {
                try{
                    const requestPath = "http://localhost:5000/getCardInformation/" + String(index)
                    const stuff = await axios.get(requestPath);
                    console.log("HEHRHRHRHHRHRHRHRH: " + stuff.data);
                    setCardContent(JSON.stringify(stuff.data))
                }catch (error){
                    console.error("Error: ", error);
                    setCardContent("There was an error! Please refer to the console.")
                }
            }
        getStuff()
        }
        
    ,[]); //this empty array means RUN ON STARTUP!

    return <div>
        <p>{
        cardContent}</p>
    </div>
}

/*
.map((item, i) => (
              <div key={i}>
                Grade: {item.grade}, Type: {item.type}
            </div>
        )
        )
*/