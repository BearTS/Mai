exports.queryString = input => {
  if (!Array.isArray(input) && Object(input) !== input) return ''

  let output = []

  unwrap(false, input)
  return '?' + output.join('&')

  function unwrap(base, input) {
    let before = '',
      after = ''
    if (base) {
      before = base + '['
      after = ']'
    }

    if (Array.isArray(input))
      for (let i = 0; i < input.length; i++) loop(i + '', input[i])
    else if (Object(input) === input)
      for (let key in input) loop(key, input[key])
    else output.push(base + '=' + encodeURIComponent(input))

    function loop(key, value) {
      unwrap(before + encodeURIComponent(key) + after, value)
    }
  }
}
