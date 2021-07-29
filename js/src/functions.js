'use strict'

const makeSpace = n => {
  let ns = ''
  for(let i = 0;i < n;i++){
    ns += '&nbsp'
  }
  return ns
}

const spacer = str => {
  let ns = ''
  for(let i = 0,l = str.length;i < l;i++){
    if(['(',')','+','-','×','÷','%','√','π','∛','^','‰',',','*','/'].includes(str.charAt(i))){
      ns += ' ' + str.charAt(i) + ' '
    }else{
      ns += str.charAt(i)
    }
  }
  return ns
}

const removeWhiteSpace = str => {
  let ns = '';
  for(let i = 0,l = str.length;i < l;i++){
     if(!(str.charAt(i) === ' ' && str.charAt(i - 1) === ' ')) ns += str.charAt(i)
  }
  return ns.trim()
}

const isOpenBracket = str => {
  let open = 0
  let closed = 0
  for(let i = 0,l = str.length;i < l;i++){
    if(str.charAt(i) === '(') open++
    if(str.charAt(i) === ')') closed++
  }

  if(open !== 0 && open > closed) return true
  else return false
}

const onstring = (str,callback) => {
  let ns = ''
  for(let i = 0,l = str.length;i < l;i++){
    ns += callback(str[i],i,str)
  }
  return ns
}

const trim = str => {
  return onstring(str,(s) => {
    return s !== ' ' ? s : ''
  })
}

const COMPOSE_FUNCTION_ID = fun => {
  return fun.name + `(${ fun.args.join(',') })`
}
