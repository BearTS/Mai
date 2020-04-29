const addCommasToString = (nStr) => {
  nStr += '';
  let x = nStr.split('.');
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
 return x1 + x2;
}

const ordinalize = (number) => {
    number += '';
    if(isNaN(number)) return number;
    if(number.length === 1){
        if (number === '1') return number + "st";
        if (number === '2') return number + "nd";
        if (number === '3') return number + "rd";
        if (number != '1'&& number != '2' && number != '3') return number + "th"
    } else {
        secLast = number[number.length - 2];
        lastLast = number[number.length - 1];
        if (secLast === '1') return number + 'th';
        else {
            if (lastLast === '1') return number + "st";
            if (lastLast === '2') return number + "nd";
            if (lastLast === '3') return number + "rd";
            if (lastLast != '1' && lastLast != '2' && lastLast != '3') return number + "th"
        }
    }
}

const convertTime = function(millisec){
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + "h:" + minutes + "m:" + seconds + "s";
    }
    return minutes + "m:" + seconds + "s";
}

const textTrunctuate = function(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

const timeZoneConvert = function(data){
  var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date1 = new Date(data)
    let date = date1.getDate();
    let year = date1.getFullYear();
    let month = months[date1.getMonth() + 1];
    let h = date1.getHours();
    let m = date1.getMinutes();
    let ampm = "AM";
    if(m < 10) {
        m = "0" + m;
    }
    if(h > 12) {
        h = h - 12;
        let ampm = "PM";
    }
    return month + " " + date + ", " + year + " " + h + ":" + m + " " + ampm;
}

const commatize = function(nStr){
   nStr += '';
   var x = nStr.split('.');
   var x1 = x[0];
   var x2 = x.length > 1 ? '.' + x[1] : '';
   var rgx = /(\d+)(\d{3})/;
   while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
   }
   return x1 + x2;
}

module.exports = {
  addCommasToString,
  ordinalize,
  convertTime,
  textTrunctuate,
  timeZoneConvert,
  commatize
}
