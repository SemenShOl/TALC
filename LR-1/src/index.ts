import { ReversePolandNotation } from "./reversePolandNotation.js";

const expression = "(4 + 3) * (2 + 5) - 4 + (-20) + (3 + 5)";
try {
  const postfix = ReversePolandNotation.infixToPostfix(expression);
  // console.log(`Обратная польская запись: ${postfix}`);
  console.log(ReversePolandNotation.calculate(postfix));
} catch (error: TError | any) {
  console.log(error.message);
}

type TError = {
  message: string;
};
