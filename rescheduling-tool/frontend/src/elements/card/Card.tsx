import {useState, useEffect} from "react";
import axios from 'axios';
import type { CardPropsFRONT } from "../../types"


export default function Card({index}: CardPropsFRONT){ //import the type of index from CardProps type
    // can change and add more later!!
    type CardItem = {
        grade: string
        type: string
        // name?: string -- example of an optional part of the map that u might want to adjust later
    }


    const [cardContent, setCardContent] = useState<CardItem[]>([]); //setCardContent is the setter for the const
    //TODO: cardContent should be of type CardItem, not string. need to show loading some other way
    // UPDATE: cardContent is now type of CardItem!
    useEffect(() => {
        async function getSpecificCardContent () {
            try {
                //now processes multiple indexes!!
                const requests = index.map((i) => {
                    console.log("card " + i + " is requesting at " + `http://localhost:5000/getCardInformation/${i+1}`);
                    return axios.get(`http://localhost:5000/getCardInformation/${i+1}`);
                });
                const responses = await Promise.all(requests);
                // res.data has a nested array with the actual data, so we call res.data[0]
                const contents = responses.map(res => res.data[0]);
                // console.log(contents)
                setCardContent(contents);
            } catch (error) {
                console.error("Error: ", error);
                // FIX THIS LATER, because card content is now a carditem type, we can't set it to an error msg
                // setCardContent(["There was an error! Please refer to the console."]);
            }
        }
        //TODO make stuff a list of card objects
        getSpecificCardContent();
        console.log(cardContent)
    }, []); //this empty array means RUN ON LOAD!

    // THIS IS WHERE WE DEFINE THE HTML FOR EACH CARD
    return (<div>
        {/* <p>name</p> */}
        
        {cardContent.map((item, i) => (
            <div key={i} className='card'>
                <h2>{item.type}</h2>
                <p>{item.grade}</p>
            </div>
        ))}
    </div>)
}

/*
.map((item, i) => (
              <div key={i}>
                Grade: {item.grade}, Type: {item.type}
            </div>
        )
        )
*/