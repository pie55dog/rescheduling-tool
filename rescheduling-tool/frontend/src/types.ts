//all frontend types stored here
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

export type CardProps = {
  index: number;
};