import {useState, useEffect, memo} from "react";
import axios from 'axios';
import type { CardPropsFRONT } from "../../types"
import type { CardItem } from "../../types"

// Create a module-level cache that persists across all Card instances
// This survives component unmount/remount cycles
const cardDataCache = new Map<string, CardItem[]>();
const pendingRequests = new Map<string, Promise<CardItem[]>>();

function Card({index}: CardPropsFRONT){
    const [cardContent, setCardContent] = useState<CardItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const cardKey = index.join("-");


    // this is an AI written use effect function! it modified the function to cache data so the cards will not make multiple requests when rerendering :)
    useEffect(() => {
        let isMounted = true;

        async function loadCardData() {
            // Check cache first
            if (cardDataCache.has(cardKey)) {
                console.log("💾 Using cached data for:", cardKey);
                if (isMounted) {
                    setCardContent(cardDataCache.get(cardKey)!);
                    setIsLoading(false);
                }
                return;
            }

            // Check if there's already a pending request for this card
            if (pendingRequests.has(cardKey)) {
                console.log("⏳ Waiting for existing request for:", cardKey);
                const contents = await pendingRequests.get(cardKey)!;
                if (isMounted) {
                    setCardContent(contents);
                    setIsLoading(false);
                }
                return;
            }

            // Create new request
            console.log("📡 FETCHING data for:", cardKey);
            const fetchPromise = (async () => {
                try {
                    const requests = index.map((i) => {
                        return axios.get(`http://localhost:5000/getCardInformation/${i+1}`);
                    });
                    const responses = await Promise.all(requests);
                    const contents = responses.map(res => res.data[0]);
                    
                    // Cache the data
                    cardDataCache.set(cardKey, contents);
                    pendingRequests.delete(cardKey);
                    
                    console.log("✅ Data loaded and cached for:", cardKey);
                    return contents;
                } catch (error) {
                    console.error("❌ Error fetching:", cardKey, error);
                    pendingRequests.delete(cardKey);
                    throw error;
                }
            })();

            pendingRequests.set(cardKey, fetchPromise);
            
            try {
                const contents = await fetchPromise;
                if (isMounted) {
                    setCardContent(contents);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCardData();

        // Cleanup function to prevent setting state on unmounted component
        return () => {
            isMounted = false;
        };
    }, [cardKey]);

    return (<div>
        {isLoading || cardContent.length === 0 ? (
            <div className='card'>
                <p>Loading...</p>
            </div>
        ) : (
            cardContent.map((item, i) => (
                <div key={i} className='card'>
                    <h2>{item.type}</h2>
                    <p>{item.grade}</p>
                </div>
            ))
        )}
    </div>)
}


// this memo thing was also written by AI 
//it basically just tells react that this component should not be rerendered since the props have not changed.
// Memoize the component to prevent unnecessary re-renders 
// unnecesary rerenders are a function of react to help w/ debugging but they add to the requst limit for google sheets
export default memo(Card, (prevProps, nextProps) => {
    return prevProps.index.join("-") === nextProps.index.join("-");
});