// import { sumNumbers, myNumber } from './module.js';

// const result = sumNumbers(5, myNumber);
// document.querySelector('main').textContent = `The result is ${result}`;



import sumNumbers from './module.js';
import { myNumber } from './module.js';

const result = sumNumbers(5, myNumber);
document.querySelector('main').textContent = `The result is ${result}`;