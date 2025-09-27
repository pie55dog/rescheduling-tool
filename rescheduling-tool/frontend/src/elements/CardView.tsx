import Card from "./card/Card"

export default function CardView() {
    return <div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card></Card>
        </div>
        <div>
            <h2 className="text-3xl">I am a card!</h2>
            <Card></Card>
        </div>
    </div>
}