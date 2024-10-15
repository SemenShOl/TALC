import fs from "fs";
import readline from "readline";
import { StateMachine } from "./StateMachine";
const data = fs.readFileSync("file.txt", "utf8");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("Введите слово: ");
rl.on("line", (input) => {
  if (input !== "exit") {
    const stateMachine = new StateMachine(data.split("\n"), "q0");
    stateMachine.iterateStates();
    if (stateMachine.wordBelongsAlphabet(input)) {
      console.log("Автомат может разобрать данное слово");
    } else {
      console.log("Автомат не может разобрать данное слово");
    }
    console.log("Введите слово: ");
  } else {
    rl.close();
    process.exit();
  }
});
