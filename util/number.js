function random(option){

  if (typeof option !== 'object'){
    option = {};
  };

  const max = Math.floor(Number(option.max)) || 100;
  let min = Math.floor(Number(option.min)) || 0;
  let amt = Math.floor(Number(option.amount)) || 1;

  if ((max - min) < amt){
    option.repeat = true;
  };

  if (amt > 100000){
    throw new Error('number.random max amount must not exceed 100000');
  };

  if (min < 0){
    min = 0;
  };

  let repeating = option.repeat === true;

  if (option.toNumber){
    amt = 1;
  };

  const res = [];

  for (i = 0; i < amt; i++){

    let cur = Math.floor(Math.random() * (max - min)) + min;

    if (!repeating){
      while (res.includes(cur)){
        cur = Math.floor(Math.random() * (max - min)) + min;
      };
    } else {
      // Do nothing
    };

    res.push(cur);
  };

  if (option.toNumber && typeof option.toNumber === 'boolean'){
    return res[0];
  } else {
    return res;
  };
};

module.exports = { random };
