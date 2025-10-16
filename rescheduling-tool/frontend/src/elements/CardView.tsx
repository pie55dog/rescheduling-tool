import Card from "./card/Card"
import {useState, useEffect} from "react";
import axios from 'axios';
import type { CardPropsBACK } from "../types"

//import type { CardProps } from "../types"
export default function CardView() {



       const [cardTo_DoList, setCardTo_DoList] = useState <CardPropsBACK[]> ([]); 
       const [cardWaitlistList, setCardWaitlistList] = useState <CardPropsBACK[]> ([]);
       const [cardDoneList, setCardDoneList] = useState <CardPropsBACK[]> ([]);

        useEffect(() => {
            async function createCardList () {
                try{
                    const requestPath = "http://localhost:5000/getAllCards" ;
                    console.log("{{{{{{retreaving all cards in CardView Element}}}}}}")
                    const cardLists = await axios.get(requestPath);
                    setCardTo_DoList(cardLists.data.To_Do)
                    setCardWaitlistList(cardLists.data.Waitlist)
                    setCardDoneList(cardLists.data.Done)
                    /*controller needs to return EITHER: 
                        a processed list
                        or a REALLY messy list of all the rows
                    i'm leaning towards having the controller or service do any processing. 
                    ===
                    So they will get all the rows, spearate into waitlist/todo/done
                    and return a list of CardProp type objects with indexes and emails

                    Then, the createCardList() function will return three lists of cards: 
                    - Waitlist
                    - To-Do
                    - Done


                    */
                }catch (error){
                    console.error("Error: ", error);
                    setCardTo_DoList([])
                    setCardWaitlistList([])
                    setCardDoneList([])
                }
            }
        createCardList()
        }
        
    ,[]); //this empty array means RUN ON LOAD!

    return <div>
        //display listy of cards here
        return (
    <div>
        <h1>
            print the lists
        </h1>
        <p>{JSON.stringify(cardTo_DoList)}</p>
        <p>{JSON.stringify(cardWaitlistList)}</p>
        <p>{JSON.stringify(cardDoneList)}</p>
        <h2>To Do</h2>
        {cardTo_DoList.map((card, i) => (
        <Card key={`todo-${i}`} index={card.index} />
        ))}

        <h2>Waitlist</h2>
        {cardWaitlistList.map((card, i) => (
        <Card key={`waitlist-${i}`} index={card.index} />
        ))}

        <h2>Done</h2>
        {cardDoneList.map((card, i) => (
        <Card key={`done-${i}`} index={card.index} />
        ))}
    </div>
)
    </div>
}

/*

OLD card test
<div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={2} studentEmail="placeholder"></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={3} studentEmail="placeholder"></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={4} studentEmail="placeholder"></Card>
        </div> 
        */