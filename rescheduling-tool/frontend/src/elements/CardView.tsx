import Card from "./card/Card"
import {useState, useEffect} from "react";
import axios from 'axios';
import type { CardPropsBACK } from "../types"
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

import type { DropResult } from "@hello-pangea/dnd";

// THIS IS WHERE ALL THE HELPER STUFF FOR DRAGGING LISTS STARTS
 // need to wrap all of them in try/excepts!
    
// function removes the item at startIndex and inserts it at endIndex
// returning a copy of the list with this new order
function reorder<T>(list: T[],startIndex: number, endIndex: number): T[] {
    // simple checks to save time
    if (startIndex === endIndex) return list;
    if (startIndex < 0 || startIndex >= list.length) return list;
    if (endIndex < 0 || endIndex > list.length) return list;

    const copy = Array.from(list)
    // we want to grab the element that we're removing
    // modifies in place, but also returns the removed element
    // doing the [] is the same thing as [0] at the end of the splice
    const [removed] = copy.splice(startIndex,1)
    copy.splice(endIndex,0,removed)
    return copy
}

// function takes an object from one list, and moves it to another!
function move<T>(sourceList: T[],destList: T[],sourceIndex: number,destIndex: number): 
{newSource: T[]; newDest: T[]} {
    if (sourceIndex < 0 || sourceIndex >= sourceList.length) return { newSource: sourceList, newDest: destList };
    if (destIndex < 0 || destIndex > destList.length) return { newSource: sourceList, newDest: destList };

    const source = Array.from(sourceList)
    const destination = Array.from(destList)

    const [moved] = source.splice(sourceIndex,1)
    destination.splice(destIndex,0,moved)
    return {newSource: source, newDest: destination}
}


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

    // HELPERS to get the id of a list easier, and change it easier
    const getListById = (id: string) => {
        if (id === "todo") return [...cardTo_DoList];
        if (id === "waitlist") return [...cardWaitlistList];
        if (id === "done") return [...cardDoneList];
        return [];
    };
    
    const setListById = (id: string, newList: CardPropsBACK[]) => {
        if (id === "todo") setCardTo_DoList(newList);
        if (id === "waitlist") setCardWaitlistList(newList);
        if (id === "done") setCardDoneList(newList);
    };
    


    // FROM DOCS type DropResult = {
    //     draggableId: string;       
    //     type: string;              
    //     reason: "DROP" | "CANCEL";
    //     source: DraggableLocation;
    //     destination?: DraggableLocation | null; 
    //     combine?: Combine | null; 
    //   };
    //handles what should happen after the mouse drops the object, called by DragDropContext
    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return; //make sure that we're moving it somewhere
        
        // for moving in same list
        if (source.droppableId === destination.droppableId) {
          const list = getListById(source.droppableId);
          const reorderedList = reorder(list, source.index, destination.index);
          setListById(source.droppableId, reorderedList);
          return;
        }
        // for moving between lists
        const sourceList = getListById(source.droppableId);
        const destList = getListById(destination.droppableId);
        const { newSource, newDest } = move(
          sourceList,
          destList,
          source.index,
          destination.index
        );
    
        setListById(source.droppableId, newSource);
        setListById(destination.droppableId, newDest);
      };
    return(
        // main wrapper
        <DragDropContext onDragEnd={handleDragEnd}>
            {/* defines an area where things can be dropped */}
            <Droppable droppableId="todo">
                {(provided) =>(
                    // provided is a package given by the library for the drag/drop to work!
                    // ... spreads out all the props
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <h2 className="card-header">To Do</h2>
                        {cardTo_DoList.map((card,i) =>(
                            // defines each object that can be dragged/dropped
                            <Draggable key={`todo-${card.index.join("-")}`} draggableId={`todo-${card.index.join("-")}`} index={i}>
                                {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Card index={card.index} />
                                </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId="waitlist">
                {(provided) =>(
                    // provided is a package given by the library for the drag/drop to work!
                    // ... spreads out all the props
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <h2 className="card-header">Waitlist</h2>
                        {cardWaitlistList.map((card,i) =>(
                            // TODO: is key supposed to be different, its an array and react expects 1 number only...
                            <Draggable key={`waitlist-${card.index.join("-")}`} draggableId={`waitlist-${card.index.join("-")}`} index={i}>
                                {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Card index={card.index} />
                                </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <Droppable droppableId="done">
                {(provided) =>(
                    // provided is a package given by the library for the drag/drop to work!
                    // ... spreads out all the props
                    // I think the ref is just like a pointer to an element? so the library can handle where to insert it in the DOM?
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <h2 className="card-header">Done</h2>
                        {cardDoneList.map((card,i) =>(
                            // TODO: is key supposed to be different, its an array and react expects 1 number only...
                            <Draggable key={`done-${card.index.join("-")}`} draggableId={`done-${card.index.join("-")}`} index={i}>
                                {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                    <Card  index={card.index} />
                                </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )

    // --OLD HTML--

    // return(<div>
        
    // <div>
    //     <h1>
    //         print the lists
    //     </h1>
    //     {/* blocking these out for now because they're annoying */}
    //     {/* <p>{JSON.stringify(cardTo_DoList)}</p>
    //     <p>{JSON.stringify(cardWaitlistList)}</p>
    //     <p>{JSON.stringify(cardDoneList)}</p> */}
    //     <h2>To Do</h2>
    //     {cardTo_DoList.map((card, i) => (
    //     <Card key={`todo-${i}`} index={card.index} />
    //     ))}

    //     <h2>Waitlist</h2>
    //     {cardWaitlistList.map((card, i) => (
    //     <Card key={`waitlist-${i}`} index={card.index} />
    //     ))}

    //     <h2>Done</h2>
    //     {cardDoneList.map((card, i) => (
    //     <Card key={`done-${i}`} index={card.index} />
    //     ))}
    // </div>

    // </div>)
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