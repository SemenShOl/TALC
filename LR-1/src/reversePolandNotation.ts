const CONST = {
  OPERATOR: "OPERATOR",
  NUMBER: "NUMBER",
  RIGHT_BRACKET: "RIGHT_BRACKET",
  LEFT_BRACKET: "LEFT_BRACKET",
};

export class ReversePolandNotation {
  public static getPriority(operator: string) {
    switch (operator) {
      case "+":
      case "-":
        return 2;
      case "*":
      case "/":
        return 3;
      case "^":
        return 4;
      case "(":
      case ")":
        return 1;
      default:
        return 0;
    }
  }

  public static isOperator(symbol: string): boolean {
    return "+-*/^()".includes(symbol);
  }
  public static infixToPostfix(expression: string) {
    const output = [];
    const operators: string[] = [];
    const tokens = expression.match(/[a-zA-Z0-9]+|[\+\-\*\/\^\(\)]/g);
    let bracketsBalance = 0;
    let minusNumber = "";
    tokens?.forEach((token, index) => {
      const previousToken = tokens[index - 1];
      const nextToken = tokens[index + 1];
      if (bracketsBalance < 0) throw new Error("Лишняя закрывающаяся скобка");

      switch (ReversePolandNotation.getTokenType(token)) {
        case CONST.NUMBER:
          if (
            previousToken &&
            ReversePolandNotation.getTokenType(previousToken) === CONST.NUMBER
          ) {
            throw new Error("Некорректное использование операндов");
          }

          output.push(minusNumber + token);
          minusNumber = "";
          break;
        case CONST.LEFT_BRACKET:
          if (
            previousToken &&
            ReversePolandNotation.getTokenType(previousToken) === CONST.NUMBER
          )
            throw new Error("Некорректное использование скобок");
          bracketsBalance++;
          operators.push(token);
          break;
        case CONST.RIGHT_BRACKET:
          bracketsBalance--;
          if (
            previousToken &&
            ReversePolandNotation.getTokenType(previousToken) === CONST.OPERATOR
          )
            throw new Error("Некорректное использование скобок");
          if (previousToken === "(") throw new Error("Пустые скобки");

          while (
            operators.length > 0 &&
            operators[operators.length - 1] !== "("
          ) {
            output.push(operators.pop());
          }
          operators.pop();
          break;
        case CONST.OPERATOR:
          if (
            previousToken &&
            ReversePolandNotation.getTokenType(previousToken) !==
              CONST.NUMBER &&
            ReversePolandNotation.getTokenType(previousToken) !==
              CONST.RIGHT_BRACKET &&
            token !== "-"
          )
            throw new Error("Некорректное использование операторов");
          if (bracketsBalance > 0 && token === "-") {
            if (
              previousToken === "(" &&
              nextToken &&
              ReversePolandNotation.getTokenType(nextToken) === CONST.NUMBER &&
              tokens[index + 2] &&
              tokens[index + 2] === ")"
            ) {
              minusNumber = "-";
            } else {
              throw new Error("Некорректное использование операторов");
            }
          } else {
            while (
              operators.length > 0 &&
              ReversePolandNotation.getPriority(
                operators[operators.length - 1]
              ) >= ReversePolandNotation.getPriority(token)
            ) {
              output.push(operators.pop());
            }
            operators.push(token);
          }
          break;
        default:
          throw new Error("Некорректный символ в выражении");
      }
    });

    if (bracketsBalance > 0) {
      throw new Error("Незакрытые скобки");
    }
    if (bracketsBalance < 0) {
      throw new Error("Лишняя закрывающаяся скобка");
    }
    // Выталкиваем оставшиеся операторы из стека в выходную строку
    while (operators.length > 0) {
      output.push(operators.pop());
    }

    return output.join(" ");
  }

  public static calculate(expression: string) {
    let a = 0;
    let b = 0;
    const stack: string[] = [];
    const withoutSpaces = expression.split(" ").filter((s) => s !== " ");

    debugger;
    withoutSpaces.forEach((token) => {
      if (ReversePolandNotation.isOperator(token)) {
        switch (token) {
          case "+":
            b = Number(stack.pop());
            a = Number(stack.pop());
            stack.push((a + b).toString());
            break;
          case "-":
            b = Number(stack.pop());
            a = Number(stack.pop());
            stack.push((a - b).toString());
            break;
          case "*":
            b = Number(stack.pop());
            a = Number(stack.pop());
            stack.push((a * b).toString());
            break;
          case "/":
            b = Number(stack.pop());
            a = Number(stack.pop());
            stack.push((a / b).toString());
            break;
          case "^":
            b = Number(stack.pop());
            a = Number(stack.pop());
            stack.push(Math.pow(a, b).toString());
            break;
        }
      } else {
        stack.push(token);
      }
    });
    return stack[stack.length - 1];
  }

  public static getTokenType(token: string) {
    if (
      token === "+" ||
      token === "-" ||
      token === "*" ||
      token === "/" ||
      token === "^"
    ) {
      return CONST.OPERATOR;
    } else if (/^-?\d*\.?\d*$/.test(token)) {
      return CONST.NUMBER;
    } else if (token === "(") {
      return CONST.LEFT_BRACKET;
    } else if (token === ")") {
      return CONST.RIGHT_BRACKET;
    }
    throw new Error(`Неизвестный оператор: ${token}`);
  }
}
