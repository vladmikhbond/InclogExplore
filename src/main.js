const fs = require('fs');
const inclog = require('./inclog');
const SEPARATOR = "@#$";


// В файле fname находится текст "_имя_\t_лог_\n_имя_\t_лог_\n..." в кодировке utf8.
// Этот текст получен следующим запросом в Tut30:
//   select username, codelogx from ticket
//   where lang='hs' and codelogx is not null and taskid = 1148
//
function frame (fname) {
    const content = fs.readFileSync(fname, 'utf8').trimEnd();
    let pairs = content.split('\n').map(x => x.split('\t'));
    for (let pair of pairs) {
        console.log("--------------------------------------------------------------------");
        console.log(`user name: ${pair[0]}    brutto log size: ${pair[1].length}`);
        d_investigatin (pair[1], 1);
    }
    
}

frame("./data/tests.txt");



// Исследует зависимость объeма лога (чистого) от параметра d - минимального размера общей строки
// logStr - строка лога, созданного при d = 1
// dMax - верхняя граница изменений параметра d
//
function d_investigatin (logStr, dMax) 
{
    
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
    let avgDeep = (sum / nonZeroDepths.length).toFixed(2);
    let thinK =  (nonZeroDepths.length / depths.length).toFixed(2);

    console.log(`max log depth: ${maxDeep}     avg log depth: ${avgDeep}      thinK: ${thinK}`);    
    
}

function depth (item) {
    if (item.length == 0)
       return 0
       if (item.length < 4)
       return 1
    return 1 + Math.max(depth(item[2]), depth(item[3]));
}



