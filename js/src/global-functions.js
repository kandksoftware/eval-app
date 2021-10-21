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

  if(open !== 0 || closed !== 0){
    if(open !== closed){
      return true
    }
    return false
  } 
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
//to keep white space use '@'
const clearTags = str => {
  let read = true
  let ns = ''
  for(let i = 0,l = str.length;i < l;i++){
    if(str[i] === '<') read = false
    if(read){
      if(str[i] === '@') ns += ' '
      else if(str[i] !== ' ' && str[i] !== '\n') ns += str[i]
    }
    else{
      ns += str[i]
    }
    if(str[i] === '>') read = true
  }
  return ns
}

const median = array => {
  array.sort((a,b) => a - b)
  const div = array.length % 2 
  if(div === 0){
    const half = array.length / 2 - 1
    return (array[half] + array[half + 1]) / 2
  }else{
    return array[parseInt(array.length / 2)]
  }
}

const initAutocomplete = config => {
  let array = config.inBuildFunction.map(f => { return {name:f,args:['x']}})
  array = array.concat(config.customFunctions)
  array = array.map(a => COMPOSE_FUNCTION_ID(a))
  array = array.concat(config.variables.map(v => v.name))
  array = array.concat(['print','show','use','as','object','diagram','@title','@maxValue'])
  array = array.concat(config.operators)
  config.autocomplete = array
}











