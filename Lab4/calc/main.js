// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.
'use strict'
function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (let char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        }
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        }
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}

// 1 + (10 − 15) * 3 в ОПН -> 1 10 15 − 3 * +


function compile(str) {
    let out = [];
    let stack = [];
    for (let token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            //7 2 * 3 +   ->       7 * 2 + 3
            while (stack.length > 0 && isOperation(stack[stack.length - 1]) && priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }

    return out.join(' ');
}


//1*(2+3)+4 ->  1 2 3 + * 4 +
// 7 2 3 * + 1 + ->       7 + 2 * 3 + 1   7 2 3 * + 1 +

//7 2 3 * +    ->       7 + 2 * 3
//14 3 +   ->       7 * 2 + 3

function evaluate(str) {
    let polish = tokenize(str);
    let stack = [];
    for (const el of polish) {
        if (isNumeric(el)) {
            stack.push(Number(el))
        } else {
            switch (el) {
                case '+':
                    stack.push(stack.pop() + stack.pop());
                    break;
                case '-':
                    let b = stack.pop();
                    let a = stack.pop();
                    stack.push(a - b);
                    break;
                case '*':
                    stack.push(stack.pop() * stack.pop());
                    break;
                case '/':
                    stack.push((stack.pop() / stack.pop())**-1);
                    break;
                default:
                    break;
            }
        }
    }

    return stack.pop().toFixed(2);
}

function clickHandler(event) {
    // your code here
    if (event.target.className in { 'key-digit': 0, 'key-operation': 1, 'key-bracket': 2 }) {
        document.querySelector('.expression').innerHTML += event.target.innerHTML;
        return;
    }

    if (event.target.className == 'key-clear') {
        document.querySelector('.expression').innerHTML = '';
    }

    if (event.target.className == 'key-result') {
    //    document.querySelector('.expression').innerHTML = compile(document.querySelector('.expression').innerHTML)
        document.querySelector('.expression').innerHTML = evaluate(compile(document.querySelector('.expression').innerHTML))
    }
}


// Назначьте нужные обработчики событий.
window.onload = function () {
    // your code here
    let buttons = document.querySelector('.buttons');
    buttons.addEventListener('click', clickHandler);
}
