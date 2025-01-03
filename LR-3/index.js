const fs = require("fs");

// Вспомогательная функция для проверки правил
function findProducingRules(grammar, symbols) {
  const result = [];
  for (const [nonTerminal, productions] of Object.entries(grammar)) {
    for (const production of productions) {
      if (
        production.length === symbols.length &&
        production.every((sym, index) => sym === symbols[index])
      ) {
        result.push(nonTerminal);
      }
    }
  }
  return result;
}

// CYK-алгоритм
function cykAlgorithm(grammar, word) {
  const n = word.length;
  const table = Array.from({ length: n }, () =>
    Array(n)
      .fill(null)
      .map(() => new Set())
  );

  // Заполняем первую строку таблицы (подстроки длины 1)
  for (let i = 0; i < n; i++) {
    const char = word[i];
    for (const [nonTerminal, productions] of Object.entries(grammar)) {
      if (productions.some((prod) => prod.length === 1 && prod[0] === char)) {
        table[i][i].add(nonTerminal);
      }
    }
  }

  // Заполняем таблицу для подстрок длины 2 и более
  for (let len = 2; len <= n; len++) {
    for (let start = 0; start <= n - len; start++) {
      const end = start + len - 1;

      // Делим подстроку на две части
      for (let split = start; split < end; split++) {
        const leftPart = table[start][split];
        const rightPart = table[split + 1][end];

        // Проверяем все комбинации нетерминалов
        for (const left of leftPart) {
          for (const right of rightPart) {
            const combined = findProducingRules(grammar, [left, right]);
            combined.forEach((nonTerminal) =>
              table[start][end].add(nonTerminal)
            );
          }
        }
      }
    }
  }

  // Результат в верхней правой ячейке таблицы
  return table[0][n - 1].has("S");
}

// Пример использования
// const grammar = {
//   S: [["A", "A"], ["A", "S"], ["b"]],
//   A: [["S", "A"], ["A", "S"], ["a"]],
// };

function parseRules(input) {
  const rules = {};
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  lines.forEach((line) => {
    const [key, value] = line.split(">").map((part) => part.trim());
    const alternatives = value.split("|").map((alt) => alt.trim());
    rules[key] = alternatives.map((alt) =>
      alt.split("").map((symbol) => symbol.trim())
    );
  });

  return rules;
}

fs.readFile("rules.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Ошибка чтения файла:", err);
    return;
  }

  const parsedRules = parseRules(data);
  console.log(parsedRules);
  const word = "S";

  if (cykAlgorithm(parsedRules, word)) {
    console.log("Слово принадлежит грамматике.");
  } else {
    console.log("Слово не принадлежит грамматике.");
  }
});
