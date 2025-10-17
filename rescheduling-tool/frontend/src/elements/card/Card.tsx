import {useState, useEffect} from "react";
import axios from 'axios';
import type { CardPropsFRONT } from "../../types"


export default function Card({index}: CardPropsFRONT){ //import the type of index from CardProps type
    const [cardContent, setCardContent] = useState<string[]>([]); //setCardContent is the setter for the const
    //TODO: cardContent should be of type CardItem, not string. need to show loading some other way
    useEffect(() => {
        async function getSpecificCardContent () {
            try {
                //now processes multiple indexes!!
                const requests = index.map((i) => {
                    console.log("card " + i + " is requesting at " + `http://localhost:5000/getCardInformation/${i+1}`);
                    return axios.get(`http://localhost:5000/getCardInformation/${i+1}`);
                });
                const responses = await Promise.all(requests);
                const contents = responses.map(res => JSON.stringify(res.data));
                setCardContent(contents);
            } catch (error) {
                console.error("Error: ", error);
                setCardContent(["There was an error! Please refer to the console."]);
            }
        }
        //TODO make stuff a list of card objects
        getSpecificCardContent();
    }, []); //this empty array means RUN ON LOAD!

    return <div>
        <p>name</p>
        {cardContent.map((item, i) => (
            <div key={i}>
                {item}
            </div>
        ))}
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