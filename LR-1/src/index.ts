import { ReversePolandNotation } from "./reversePolandNotation.js";
import readline from "readline";

// const expression = "(4 + 3) * (2 + 5) - 4 + (-20) + (3 + 5)";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Введите выражение: ");
rl.on("line", (input) => {
  if (input !== "exit") {
    try {
      const postfix = ReversePolandNotation.infixToPostfix(input);
      console.log(ReversePolandNotation.calculate(postfix));
    } catch (error: TError | any) {
      console.log(error.message);
    }
    console.log("Введите выражение: ");
  } else {
    rl.close();
    process.exit();
  }
});

type TError = {
  message: string;
};
