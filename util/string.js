function textTruncate(str, length = 100, end = '...'){
  if (!str || str.length < length || typeof str !== 'string') return str;

  return str.substring(0, length - end.length) + end;
};

function truncate(...options){
  return textTruncate(...options);
};

function joinArray(array = []){

  if (!Array.isArray(array)) return array;

  if (!array.length) return null;

  if (array.length === 2){
    return `${array[0]} and ${array[1]}`;
  };

  return array.reduce((acc, cur, i) => {
    if (i === array.length - 1)
    return `${acc}, and ${cur}`;

    return `${acc}, ${cur}`;
  });
};

function joinArrayAndLimit(array = [], limit = 1000, connector = '\n'){
  if (!Array.isArray(array)) return { text: '', excess: 0 };

  if (!array.length) return { text: '', excess: 0 };

  if (array.length === 2){
    return { text: `${array[0]} and ${array[1]}`, excess: 0 };
  };

  let excess = 0;
  const text = array.reduce((acc, curr) => {
    if (acc.length + curr.length + connector.length > limit){
      excess++;
      return acc;
    };

    acc = acc + connector;
    return acc + curr;
  });

  return { text, excess }
}

function commatize(number = ''){
  number = number.toString();

  let x = number.split('.')
  let x1 = x[0];
  let x2 = x.length > 1 ? '.' + x[1] : '';
  let rgx = /(\d+)(\d{3})/;

  while (rgx.test(x1)){
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  };

  return x1 + x2;
};

function ordinalize(number = ''){
  number = number.toString();

  if (isNaN(number)) return number;

  const last = number[number.length - 1];
  const seclast = number[number.length - 2];

  if (seclast == 1) return number + 'th';

  const ordinalize = ['st', 'nd', 'rd'][Number(last) - 1] || 'th';

  return number + ordinalize;
};

module.exports = { textTruncate, truncate, joinArray, joinArrayAndLimit, commatize, ordinalize };
