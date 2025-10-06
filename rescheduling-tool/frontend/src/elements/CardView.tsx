import Card from "./card/Card"
//import type { CardProps } from "../types"
export default function CardView() {
    return <div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={2}></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={3}></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card index={4}></Card>
        </div>
    </div>
}