const helpers = require('./helpers');

test("getMinutesWorked()- Calculates from starttime, endtime, lunchtime", () => {
    expect(helpers.getMinutesWorked('2021-08-03T17:53:00.000Z', '2021-08-03T20:53:00.000Z', 0)).toBe(180);
    expect(helpers.getMinutesWorked('2021-08-03T17:53:00.000Z', '2021-08-03T20:53:00.000Z', 60)).toBe(120);
    expect(helpers.getMinutesWorked('2021-08-03T08:53:00.000Z', '2021-08-03T13:33:00.000Z', 0)).toBe(280);
    expect(helpers.getMinutesWorked('2021-08-03T08:53:00.000Z', '2021-08-03T13:33:00.000Z', 45)).toBe(235);
    expect(helpers.getMinutesWorked('2021-08-03T00:00:00.000Z', '2021-08-03T20:53:00.000Z', 0)).toBe(1253);
    expect(helpers.getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', 0)).toBe(240);
    expect(helpers.getMinutesWorked('2021-0asdf8-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', 0)).toBe(-3);
    expect(helpers.getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:3lkdle0:00.000Z', 0)).toBe(-3);
    expect(helpers.getMinutesWorked('2021-08-03T20:30:00.000Z', '2021-08-04T00:30:00.000Z', -14)).toBe(-3);
    expect(helpers.getMinutesWorked()).toBe(-3);
});
test("minutesToDigital()- Changes time format to 6.45", () => {
    expect(helpers.minutesToDigital(83)).toBe(1.38);
    expect(helpers.minutesToDigital('83')).toBe(1.38);
    expect(helpers.minutesToDigital(15)).toBe(.25);
    expect(helpers.minutesToDigital(387)).toBe(6.45);
    expect(helpers.minutesToDigital(1387)).toBe(23.11);
    expect(helpers.minutesToDigital(138700)).toBe(2311.66);
    expect(helpers.minutesToDigital(0)).toBe(0);
    expect(helpers.minutesToDigital('0')).toBe(0);
    expect(helpers.minutesToDigital()).toBe('Invalid Entry');
    expect(helpers.minutesToDigital('random string')).toBe('Invalid Entry');
    expect(helpers.minutesToDigital(-4)).toBe('Invalid Entry');
    expect(helpers.minutesToDigital('-4')).toBe('Invalid Entry');
});
// test("minutesToText()- Changes time format to '3 hours and 7 mins'", () => {
//     expect(helpers.minutesToText(83)).toBe('1 hour and 23 mins');
//     expect(helpers.minutesToText('83')).toBe('1 hour and 23 mins');
//     expect(helpers.minutesToText(15)).toBe('0 hours and 15 mins');
//     expect(helpers.minutesToText(387)).toBe('6 hours and 27 mins');
//     expect(helpers.minutesToText(1387)).toBe('23 hours and 7 mins');
//     expect(helpers.minutesToText(138700)).toBe('2311 hours and 40 mins');
//     expect(helpers.minutesToText(0)).toBe('0 hours and 0 mins');
//     expect(helpers.minutesToText('0')).toBe('0 hours and 0 mins');
//     expect(helpers.minutesToText()).toBe('(could not find number of minutes worked)');
//     expect(helpers.minutesToText('random string')).toBe('(could not find number of minutes worked)');
//     expect(helpers.minutesToText(-4)).toBe('(could not find number of minutes worked)');
//     expect(helpers.minutesToText('-4')).toBe('(could not find number of minutes worked)');
// });
// test('entryEditable() - Is entry editable', () => {
//     expect(helpers.entryEditable({downloaded: true}, true)).toBe(true);
//     expect(helpers.entryEditable({downloaded: true}, false)).toBe(false);
//     expect(helpers.entryEditable({downloaded: false}, true)).toBe(true);
//     expect(helpers.entryEditable({downloaded: false}, false)).toBe(true);
//     expect(helpers.entryEditable()).toBe(false);
// });
// //function updateLunchTimeFromEdit
// test('Convert lunchtime select box entries to a number', () => {
//     expect(helpers.updateLunchTimeFromEdit('0 minutes')).toBe(0);
//     expect(helpers.updateLunchTimeFromEdit('15 minutes')).toBe(15);
//     expect(helpers.updateLunchTimeFromEdit('90 minutes')).toBe(90);
//     expect(helpers.updateLunchTimeFromEdit('Lunch Time?')).toBe('Lunch Time?');
//     expect(helpers.updateLunchTimeFromEdit('')).toBe('Lunch Time?');
//     expect(helpers.updateLunchTimeFromEdit(null)).toBe('Lunch Time?');
//     expect(helpers.updateLunchTimeFromEdit(undefined)).toBe('Lunch Time?');
//     expect(helpers.updateLunchTimeFromEdit('random string')).toBe('Lunch Time?');
//     expect(helpers.updateLunchTimeFromEdit('-13 minutes')).toBe('Lunch Time?');
// });
// //function militaryToAMPM
// test('Military Time to Standard Time (AM/PM)', () => {
//     expect(helpers.militaryToAMPM('17:52')).toBe('5:52 PM');
//     expect(helpers.militaryToAMPM('08:03')).toBe('8:03 AM');
//     expect(helpers.militaryToAMPM('12:00')).toBe('12:00 PM');
//     expect(helpers.militaryToAMPM('00:00')).toBe('12:00 AM');
//     expect(helpers.militaryToAMPM('11:59')).toBe('11:59 AM');
//     expect(helpers.militaryToAMPM('23:59')).toBe('11:59 PM');
//     expect(helpers.militaryToAMPM('')).toBe('--:--');
//     expect(helpers.militaryToAMPM('24:00')).toBe('12:00 PM');
//     expect(helpers.militaryToAMPM('25:00')).toBe('--:--');
//     expect(helpers.militaryToAMPM(null)).toBe('--:--');
//     expect(helpers.militaryToAMPM(undefined)).toBe('--:--');
//     expect(helpers.militaryToAMPM('13:61')).toBe('--:--');
//     expect(helpers.militaryToAMPM('-13:51')).toBe('--:--');
//     expect(helpers.militaryToAMPM('13:-51')).toBe('--:--');
// });
// // function addZero
// test('Insert 0 at front of item of length 1.', () => {
//     expect(helpers.addZero(1)).toBe('01');
//     expect(helpers.addZero('1')).toBe('01');
//     expect(helpers.addZero(15)).toBe('15');
//     expect(helpers.addZero('15')).toBe('15');
//     expect(helpers.addZero(1500)).toBe('1500');
//     expect(helpers.addZero('1500')).toBe('1500');
//     expect(helpers.addZero('#')).toBe('0#');
//     expect(helpers.addZero('random_string')).toBe('random_string');
// });
// // function checkJobsite()
// test('Checks that jobsite is in joblist', () => {
//     expect(helpers.checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: 'C3253d Ernie'})).toBe(true);
//     expect(helpers.checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: '32563 Big Bird'})).toBe(true);
//     expect(helpers.checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: '325ds63 Big Bird'})).toBe(false);
//     expect(helpers.checkJobsite([['13525', 'Bert'], ['C3253d', 'Ernie'], ['32563', 'Big Bird']], {jobname: 'jekcs Oscar'})).toBe(false);
//     expect(helpers.checkJobsite([], {jobname: 'jekcs Oscar'})).toBe(false);
//     expect(helpers.checkJobsite([])).toBe(false);
//     expect(helpers.checkJobsite([], '')).toBe(false);
//     expect(helpers.checkJobsite()).toBe(false);
// });

