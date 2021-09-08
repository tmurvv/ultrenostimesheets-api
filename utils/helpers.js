exports.getMinutesWorked = (starttime, endtime, lunchtime) => {
    // shortcut if endtime before starttime
    if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
    // calculate time worked
    const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
    const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
    // short cut is lunchtime greater than time worked
    if (milliesWorked<=0) return -2;
    //return minutes worked
    return Math.round((milliesWorked/60)/1000);
}
exports.minutesToDigital = (minutes) => {
    const m = minutes % 60;  
    const h = (minutes-m)/60;   
    const dec = parseInt((m/6)*10, 10);
    return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
}
exports.getDateWorked = (entry) => {
    const entryDate = new Date(entry);
    const month=(entryDate.getMonth()+1)<10?`0${entryDate.getMonth()+1}`:entryDate.getMonth()+1;
    const date=(entryDate.getDate())<10?`0${entryDate.getDate()}`:entryDate.getDate();
    return `${entryDate.getFullYear()}-${month}-${date}`
}
exports.cleanCommas = (sheet) => {
    sheet.firstname=sheet.firstname.replace(/,/g, '/');
    sheet.lastname=sheet.lastname.replace(/,/g, '/');
    sheet.jobid=sheet.jobid.replace(/,/g, '/');
    sheet.jobname=sheet.jobname.replace(/,/g, '/');
    sheet.task=sheet.task.replace(/,/g, '/');
    sheet.notes=sheet.notes.replace(/,/g, '/');
}







// function getMinutesWorked(starttime, endtime, lunchtime) {
//     // shortcut if endtime before starttime
//     if ((new Date(endtime)).getTime()-(new Date(starttime)).getTime()<=0) return -1;
//     // calculate time worked
//     const lunchMillies = Number(String(lunchtime).substr(0,2)*60*1000);
//     const milliesWorked = (new Date(endtime)).getTime()-(new Date(starttime)).getTime()-lunchMillies;
//     // short cut is lunchtime greater than time worked
//     if (milliesWorked<=0) return -2;
//     //return minutes worked
//     return Math.round((milliesWorked/60)/1000);
// }
// function minutesToDigital(minutes) {
//     const m = minutes % 60;  
//     const h = (minutes-m)/60;   
//     const dec = parseInt((m/6)*10, 10);
//     return parseFloat(parseInt(h, 10) + '.' + (dec<10?'0':'') + dec);
// }

