export class StateMachine {
  public states: string[];
  public transitions = {} as { [key: string]: string };
  public mark: string = "";
  constructor(states: string[], mark: string) {
    this.states = states;
    this.mark = mark;
  }

  iterateStates() {
    this.states.forEach((line) => {
      const initialState = line.split(",")[0];
      let nextState = line.split("=")[1];
      let symbol = line.split(",")[1].split("=")[0];

      if (line.includes("==")) {
        nextState = line.split("==")[1];
        symbol = "=";
      }
      this.transitions[initialState.toString() + symbol] = nextState;
    });
  }

  wordBelongsAlphabet(word: string): boolean {
    for (let symbol of word) {
      if (this.transitions[this.mark + symbol]) {
        this.mark = this.transitions[this.mark + symbol];
      } else {
        // console.log("this.mark: ", this.mark);
        // console.log("this.symbol: ", symbol);
        return false;
      }
    }
    if (!this.mark.includes("f")) {
      return false;
    }
    return true;
  }
}
