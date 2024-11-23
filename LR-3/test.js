const fs = require("fs");
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
function parseRules(rules) {
  const grammar = {};

  rules.forEach((rule) => {
    // Разделяем правило по "→"
    const [left, right] = rule.split(">");

    // Разделяем правую часть по "|", если таковые есть, и затем разбиваем на символы
    const rightParts = right.split("|").map((part) => part.trim().split(""));

    // Если для текущего нетерминала ещё нет записей в объекте, добавляем новый массив
    if (!grammar[left.trim()]) {
      grammar[left.trim()] = [];
    }

    // Добавляем все правые части в массив для текущего нетерминала
    grammar[left.trim()].push(...rightParts);
  });

  return grammar;
}

// Пример входных данных (правила грамматики)
// const rules = ["S>AB", "S>C", "C>SS", "A>(", "B>)"];

// Вызов функции для парсинга правил
// const grammar = parseRules(rules);

// Выводим результат
// console.log(grammar);
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

fs.readFile("rules2.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Ошибка чтения файла:", err);
    return;
  }
  console.log(data);
  const dataArr = data.split("\n");
  const parsedRules = parseRules(dataArr);
  console.log(parsedRules);
  const word = "(())";

  if (cykAlgorithm(parsedRules, word)) {
    console.log("Слово принадлежит грамматике.");
  } else {
    console.log("Слово не принадлежит грамматике.");
  }
});
