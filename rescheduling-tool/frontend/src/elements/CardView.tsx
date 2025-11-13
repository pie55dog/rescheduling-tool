//This doc has a lot of AI!
// since front end is something I don't really care about, I got AI to generate it 
// and add sufficent comments such that a front end dev could easily understand 
//what is going on. 

//to sum it up in my own words, this element is an organizer for cards. I created this 
//react structure in order to maintain 'less information' per component (OOP standard)
//it will organize everything by location in the master AllCards list.
//OG drag drop function by Deniz Soral.


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

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS FOR LIST MANIPULATION
// ═══════════════════════════════════════════════════════════════════════



/**
 * MOVE FUNCTION
 * 
 * Moves a card from one list to another
 * Note: We no longer use destIndex - cards are always appended and then sorted
 * 
 * @param sourceList - The list we're taking the card from
 * @param destList - The list we're adding the card to
 * @param sourceIndex - Position in source list to remove from
 * @param destIndex - (Ignored - kept for compatibility with drag-drop library)
 * @returns Object with newSource and newDest arrays
 */
function move<T>(sourceList: T[], destList: T[], sourceIndex: number): 
{newSource: T[]; newDest: T[]} {
    // Validation checks
    if (sourceIndex < 0 || sourceIndex >= sourceList.length) {
        return { newSource: sourceList, newDest: destList };
    }

    // Create copies to avoid mutating original arrays
    const source = Array.from(sourceList)
    const destination = Array.from(destList)

    // Remove card from source list
    const [moved] = source.splice(sourceIndex, 1)
    
    // Add card to END of destination list (position will be fixed by sorting)
    destination.push(moved)
    
    return {newSource: source, newDest: destination}
}

/**
 * SORT BY ALL CARDS ORDER
 * 
 * Sorts a list of cards based on their order in the master allCardList.
 * This ensures cards always maintain their canonical ordering regardless
 * of how they were dragged and dropped.
 * 
 * Algorithm:
 * 1. For each card in the list to sort
 * 2. Find its position in allCardList by comparing lowest indices
 * 3. Sort by those positions
 * 
 * @param list - The list to sort (e.g., cardTo_DoList)
 * @param allCards - The master list defining canonical order
 * @returns Sorted copy of the list
 */
function sortByAllCardsOrder(list: CardPropsBACK[], allCards: CardPropsBACK[]): CardPropsBACK[] {
    // Create a copy to avoid mutating the original
    const copy = Array.from(list);
    
    /**
     * Helper: Get the lowest index from a card's index array
     * Examples:
     *   [15] → 15
     *   [4, 5, 6] → 4
     *   [10, 2, 8] → 2
     */
    const getLowestIndex = (card: CardPropsBACK): number => {
        return Math.min(...card.index);
    };
    
    /**
     * Helper: Find a card's position in allCardList
     * Returns the array index (0, 1, 2, ...) or Infinity if not found
     * 
     * We compare by lowest index because that's the card's canonical identifier
     */
    const getPositionInAllCards = (card: CardPropsBACK): number => {
        const cardLowestIndex = getLowestIndex(card);
        
        
        // Find the card in allCards that has the same lowest index
        let position = -1;
        for (let i = 0; i < allCards.length; i++) {
            if (getLowestIndex(allCards[i]) === cardLowestIndex) {
                position = i;
                break;
            }
        }
        
        // If not found, return Infinity (will sort to end)
        return position === -1 ? Infinity : position;
    };
    
    // Sort the list based on position in allCards
    copy.sort((a, b) => {
        const posA = getPositionInAllCards(a);
        const posB = getPositionInAllCards(b);
        return posA - posB; // Ascending order
    });
    
    return copy;
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════

export default function CardView() {
    // State: Three separate lists for each column
    const [cardTo_DoList, setCardTo_DoList] = useState<CardPropsBACK[]>([]);
    const [cardWaitlistList, setCardWaitlistList] = useState<CardPropsBACK[]>([]);
    const [cardDoneList, setCardDoneList] = useState<CardPropsBACK[]>([]);
    
    // State: Master list defining canonical order
    const [allCardList, setallCardList] = useState<CardPropsBACK[]>([]);

    /**
     * EFFECT: Load all cards from backend on mount
     * Backend should return cards already sorted by index
     */
    useEffect(() => {
        
        async function createCardList() {
            try {
                const requestPath = "http://localhost:5000/getAllCards";
                console.log("{{{{{{retrieving all cards in CardView Element}}}}}}")
                const cardLists = await axios.get(requestPath);
                
                // Set all lists from backend response
                // Assuming backend returns pre-sorted lists
                setCardTo_DoList(cardLists.data.To_Do)
                setCardWaitlistList(cardLists.data.Waitlist)
                setCardDoneList(cardLists.data.Done)
                setallCardList(cardLists.data.AllCards)
                
            } catch (error) {
                console.error("Error: ", error);
                // On error, reset to empty lists
                setCardTo_DoList([])
                setCardWaitlistList([])
                setCardDoneList([])
                setallCardList([])
            }
        }
        createCardList()
        console.log(allCardList);
    }, []); // Empty dependency array = run once on mount

    /**
     * HELPER: Get a list by its string ID
     * Returns a copy to avoid accidental mutations
     */
    const getListById = (id: string): CardPropsBACK[] => {
        if (id === "todo") return [...cardTo_DoList];
        if (id === "waitlist") return [...cardWaitlistList];
        if (id === "done") return [...cardDoneList];
        return [];
    };
    
    /**
     * HELPER: Update a list by its string ID
     */
    const setListById = (id: string, newList: CardPropsBACK[]) => {
        if (id === "todo") setCardTo_DoList(newList);
        if (id === "waitlist") setCardWaitlistList(newList);
        if (id === "done") setCardDoneList(newList);
    };

    /**
     * DRAG END HANDLER
     * 
     * Called when user finishes dragging a card.
     * Now automatically sorts both source and destination lists!
     * 
     * @param result - Contains source/destination info from drag-drop library
     */
    const handleDragEnd = (result: DropResult) => {
        
        const { source, destination } = result;
        
        // User dropped outside any valid drop zone
        if (!destination) return;

        // User dropped in the same list (no change needed)
        if (source.droppableId === destination.droppableId) {
            return;
        }

        // ───────────────────────────────────────────────────────────────
        // Move the card between lists
        // ───────────────────────────────────────────────────────────────
        const sourceList = getListById(source.droppableId);
        const destList = getListById(destination.droppableId);
        
        // Move returns unsorted lists
        const { newSource, newDest } = move(
            sourceList,
            destList,
            source.index,
            
        );

        // ───────────────────────────────────────────────────────────────
        // Sort both lists by allCardList order
        // ───────────────────────────────────────────────────────────────
        const sortedSource = sortByAllCardsOrder(newSource, allCardList);
        const sortedDest = sortByAllCardsOrder(newDest, allCardList);

        // ───────────────────────────────────────────────────────────────
        // Update state with sorted lists
        // ───────────────────────────────────────────────────────────────
        setListById(source.droppableId, sortedSource);
        setListById(destination.droppableId, sortedDest);
        
        console.log(`📦 Moved card from ${source.droppableId} to ${destination.droppableId} (auto-sorted)`);
    };

    // ═══════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════
    return(
        <div className="flex gap-4 p-4">
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* ═══════════════════════════════════════════════════ */}
                {/* TO-DO COLUMN                                        */}
                {/* ═══════════════════════════════════════════════════ */}
                <Droppable droppableId="todo">
                    {(provided, snapshot) =>(
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={`flex-1 min-h-[500px] p-4 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-blue-100' : 'bg-gray-50'
                            }`}
                        >
                            <h2 className="card-header text-xl font-bold mb-4">
                                To Do ({cardTo_DoList.length})
                            </h2>
                            {cardTo_DoList.map((card, i) =>(
                                <Draggable 
                                    key={card.index.join("-")} 
                                    draggableId={card.index.join("-")} 
                                    index={i}
                                >
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps}
                                            className={`mb-2 transition-shadow ${
                                                snapshot.isDragging ? 'shadow-lg opacity-80' : ''
                                            }`}
                                        >
                                            <Card index={card.index} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                
                {/* ═══════════════════════════════════════════════════ */}
                {/* WAITLIST COLUMN                                     */}
                {/* ═══════════════════════════════════════════════════ */}
                <Droppable droppableId="waitlist">
                    {(provided, snapshot) =>(
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={`flex-1 min-h-[500px] p-4 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-yellow-100' : 'bg-gray-50'
                            }`}
                        >
                            <h2 className="card-header text-xl font-bold mb-4">
                                Waitlist ({cardWaitlistList.length})
                            </h2>
                            {cardWaitlistList.map((card, i) =>(
                                <Draggable 
                                    key={card.index.join("-")} 
                                    draggableId={card.index.join("-")} 
                                    index={i}
                                >
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps}
                                            className={`mb-2 transition-shadow ${
                                                snapshot.isDragging ? 'shadow-lg opacity-80' : ''
                                            }`}
                                        >
                                            <Card index={card.index} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                
                {/* ═══════════════════════════════════════════════════ */}
                {/* DONE COLUMN                                         */}
                {/* ═══════════════════════════════════════════════════ */}
                <Droppable droppableId="done">
                    {(provided, snapshot) =>(
                        <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef}
                            className={`flex-1 min-h-[500px] p-4 rounded-lg transition-colors ${
                                snapshot.isDraggingOver ? 'bg-green-100' : 'bg-gray-50'
                            }`}
                        >
                            <h2 className="card-header text-xl font-bold mb-4">
                                Done ({cardDoneList.length})
                            </h2>
                            {cardDoneList.map((card, i) =>(
                                <Draggable 
                                    key={card.index.join("-")} 
                                    draggableId={card.index.join("-")} 
                                    index={i}
                                >
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef} 
                                            {...provided.draggableProps} 
                                            {...provided.dragHandleProps}
                                            className={`mb-2 transition-shadow ${
                                                snapshot.isDragging ? 'shadow-lg opacity-80' : ''
                                            }`}
                                        >
                                            <Card index={card.index} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
}