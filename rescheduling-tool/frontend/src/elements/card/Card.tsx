import {useState, useEffect} from "react";
import axios from 'axios';
import type { CardPropsFRONT } from "../../types"


export default function Card({index}: CardPropsFRONT){ //import the type of index from CardProps type
    const [cardContent, setCardContent] = useState <string> ("loading.."); //setCardContent is the setter for the const
    //TODO: cardContent should be of type CardItem, not string. need to show loading some other way
        useEffect(() => {
            async function getStuff () {
                try{
                    //TODO: get to be able to process multiple indexs (rn its throwing and making wierd stuff)
                    const requestPath = "http://localhost:5000/getCardInformation/" + index.toString();
                    console.log("card " + index + " is requesting at " + requestPath)
                    const cardInfo = await axios.get(requestPath);
                    setCardContent(JSON.stringify(cardInfo.data))
                }catch (error){
                    console.error("Error: ", error);
                    setCardContent("There was an error! Please refer to the console.")
                }
            }
        getStuff()
        }
        
    ,[]); //this empty array means RUN ON LOAD!

    return <div>
        <p>name</p>
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