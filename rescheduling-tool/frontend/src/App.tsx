
import CardView from './elements/CardView'
import HistoryView from './elements/HistoryView';
import NavBar from './elements/NavBar'
import WaitlistView from './elements/WaitlistView';
import './index.css'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
function App() {

  /* 
  * overview *
  ROUTES controls what displays based on the URL. 
  The reason for the double redundancy of the CardView element is inclase the user is directed
  to the website with no information after the URL.
  */
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
            <Route path="/" element={<CardView />} /> 
            <Route path="/home" element={<CardView />} />
            <Route path="/waitlists" element={<WaitlistView />} />
            <Route path="/history" element={<HistoryView />} />
          
        </Routes>
      </Router>
      
      
    </>
  )
}

export default App
