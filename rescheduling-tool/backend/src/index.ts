import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello foo!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export default app;