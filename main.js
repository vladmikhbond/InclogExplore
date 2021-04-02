const fs = require('fs')
const inclog = require('./inclog');
const SEPARATOR = "@#$";

//let logStr1 = '[["","aaa"],[],["aaa","bbb"]]';
var fname = "fpBerkovskyi28197.txt"; 
var fname = "fpBurtsev28200.txt";  
var fname = "fpTisheninova28201.txt";  
const logStr = fs.readFileSync('data/' + fname, 'utf8').slice(1);

let logJson = JSON.parse(logStr);


let ts = inclog.separate_log(logJson, SEPARATOR).frames;
ts.unshift("");

for (let d = 1; d < 10; d++)
{
    let newLog = [];
    for (let i = 1; i < ts.length; i++)
    {
        let changes = inclog.changes(ts[i-1], ts[i], d);
        newLog.push(changes);
    }
    let newLogStr = JSON.stringify(newLog);
    console.log(`d:${d}   netto log size ${newLogStr.length}`);
}

console.log(`---- brutto log size: ${logStr.length}`);


