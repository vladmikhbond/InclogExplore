const fs = require('fs');
const inclog = require('./inclog');
const SEPARATOR = "@#$";


var fname = "fpTisheninova28201.txt";   
//var fname = "fpBurtsev28200.txt";  
//var fname = "fpBerkovskyi28197.txt";
const logStr = fs.readFileSync('data/' + fname, 'utf8').slice(1);

d_investigatin(logStr, 10);

// Исследует зависимость объeма лога (чистого) от параметра d - минимального размера общей строки
// logStr - строка лога, созданного при d = 1
// dMax - верхняя граница изменений параметра d
//
function d_investigatin (logStr, dMax) 
{
    console.log(`brutto log size: ${logStr.length}`);
    let logJson = JSON.parse(logStr); 
    
    // frames - массив состояний кода 
    let o = inclog.separate_log(logJson, SEPARATOR);
    let frames = o.frames;
    frames.unshift("");

    // Исследование зависимости объeма лога от d
    for (let d = 1; d <= dMax; d++) 
    {
        let cleanedLog = [];
        for (let i = 1; i < frames.length; i++)
        {
            let logItem = inclog.changes(frames[i-1], frames[i], d);
            cleanedLog.push(logItem);
        }
        // report
        let size = JSON.stringify(cleanedLog).length;
        console.log(`d:${d}   netto log size ${size}`);    
    } 
    
    // определение максимальной и средней глубины рекурсии в элементах лога
    let depths = o.log.map(depth);
    let nonZeroDepths = depths.filter(x => x > 0);
    let sum = depths.reduce((a, x) => a + x);
    
    let maxDeep = Math.max(...depths);
    let avgDeep = sum / nonZeroDepths.length;
    let thinK =  nonZeroDepths.length / depths.length;

    console.log(`max depth: ${maxDeep}     avg depth: ${avgDeep}      thinK: ${thinK}`);    
    
}

function depth (item) {
    if (item.length == 0)
       return 0
       if (item.length < 4)
       return 1
    return 1 + Math.max(depth(item[2]), depth(item[3]));
}



