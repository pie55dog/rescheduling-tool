//all frontend types stored here


export type CardItem = {
  grade: string;
  name: string;
  //waitlistOverImm: "Yes" | "No" | "Depends"; //Ryan no longer is going to provide this feild on the form
  dropInstructions: string;
  reason: string;
  classesToDrop: string;
  //COURSES TO CHANGE!
  rankedChoices: Array<string> //TODO: get controller or service to do this
  finalComments: string;
};


//* reason for this deistinction is because CardView gets a lot of 
//* backend props but only needs to pass certain 1s to card component

export type CardPropsFRONT = {
  index: Array<number>; //index can be a number or an array of numbers
};

export type CardPropsBACK = { 
  index: Array<number> ; //index can be a single number or an array of numbers
  studentEmail: string;
  isWaitlisted: boolean;
  isDone: boolean; 
  
};