module.exports = {

  textTrunctuate: (str, length, ending) => {
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
    },

  joinArray: (array) => {

    if (!array.length) return `${array.toString()}`

    if (array.length < 3) return `${array.join(' and ')}.`

    const last = array.pop()

    const res = `${array.join(', ')}, and ${last}.`

    return res
  },

  commatize: (nStr) => {
     nStr += '';
     var x = nStr.split('.');
     var x1 = x[0];
     var x2 = x.length > 1 ? '.' + x[1] : '';
     var rgx = /(\d+)(\d{3})/;
     while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
     }
     return x1 + x2;
  },

  timeZoneConvert: (data) => {
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
  },

  ordinalize: (number) => {
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

}
