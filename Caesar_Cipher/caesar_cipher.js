/***********************
*
* Lab2: Caesar Cipher
*
* Auther: Fan Luo
* Date: 09/07/2018
*
***********************/

const fs = require('fs')
const path = require('path')
const readline = require('readline')

let rl = readline.createInterface(process.stdin, process.stdout);
rl.question("Please input file name: ", filename => {
  fs.readFile(path.join(__dirname, filename), 'utf-8', (err, data) => {
    if (err) {
      console.error("An error occured while opening file, ", err);
    } else {
      saveToFile(decode(data));
    }
  })
  rl.close();
})

function saveToFile(str) {
  fs.writeFile(path.join(__dirname, 'solution.txt'), str, 'utf-8', (err) => {
    if (err) {
      console.error("An error occured while writing file, ", err);
    }
    else {
      console.log("Decoding successful.");
    }
  })
}

function decode(str) {
  let key = 5;
  var result = "";
  for (let i = 0; i < str.length; i++) {
    if (i % 3 == 0 && i != 0) key = (key + 2) % 26;
    result += move(str.charAt(i).charCodeAt(0), key)
  }
  return result
}

function move(charCode, key) {
  if (charCode >=65 && charCode <= 90) {
    if (charCode -  key < 65) {
      return String.fromCharCode(91 - (key - (charCode - 65)));
    } else {
      return String.fromCharCode(charCode -  key);
    }
  } else if (charCode >= 97 && charCode <= 122) {
    if (charCode -  key < 97) {
      return String.fromCharCode(123 - (key - (charCode - 97)));
    } else {
      return String.fromCharCode(charCode -  key);
    }
  } else {
    return String.fromCharCode(charCode);
  }
}
