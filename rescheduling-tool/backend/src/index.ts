import express, { Request, Response } from 'express';

import getAllRoute from './routes/getAllRoute'


const cors = require('cors'); //makes it so things won't get blocked when they reach backend
const app = express();
const port = process.env.PORT || 5000;



app.use(cors({
  origin: 'http://localhost:5173' // allows 
}));

app.use(express.json());

//this is a test
app.get('/', (req: Request, res: Response) => {
  res.send('Hello foo!');
});


//* MOUNTING ALL ROUTES TO SERVER
app.use("/getsomeAB", getAllRoute)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;