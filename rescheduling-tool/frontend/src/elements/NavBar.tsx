//import React from "react";

export default function NavBar(){
    return <div className="bg-red-50">
        <p>hello, i am the nav bar</p>
        <span className="flex justify-right gap-9">
            <a href="/home">home</a>
            <a href="/waitlists">waitlists</a>
            <a href="/history">history</a>
        </span>
    </div>
}