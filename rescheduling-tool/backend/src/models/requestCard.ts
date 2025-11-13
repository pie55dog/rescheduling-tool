export type CardItem = {
  grade: string;
  name: string;
  waitlistOverImm: string;
  dropInstructions: string;
  reason: string;
  classesToDrop: string;
  //COURSES TO CHANGE!
  rankedChoices: Array<string> //TODO: get controller to do this
  finalComments: string;
};

export type CardPropsBACK = { //(backend)
  index: Array<number> ; //index can be a single number or an array of numbers
  studentEmail: string;
  isWaitlisted: boolean;
  isDone: boolean; 
  
};