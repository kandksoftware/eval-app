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

class PairNestedTest{
  constructor(targets = []){
    this._targets = targets
  }
  _findDeppest(str,target){
    let lloc = -1
    for(let i = 0,l = str.length;i < l;i++){
      if(str[i] === target) lloc = i
    }
    return lloc
  }
  
  _findFrom(str,target,from){
    for(let i = from,l = str.length;i < l;i++){
      if(str[i] === target) return i
    }
    return -1
  }
  //if returns string with any brackets it means they are not nested correctly
  _areProperelyNested(str){
    const OPEN = '('
    const CLOSE = ')'
    const lo = this._findDeppest(str,this._targets[0])
    if(lo === -1) return str
    else{
      const ff = this._findFrom(str,this._targets[1],lo + 1)
      if(ff === -1) return str
      const s = str.slice(0,lo)
      const e = str.slice(ff + 1)
      str = s + e
      return this._areProperelyNested(s + e)
    }
  }

  _isContainesTargets(str){
    for(let i = 0,l = str.length;i < l;i++){
      if(str[i] === this._targets[0] || str[i] === this._targets[1]) return false
    }
    return true
  }

  exec(str){
    return this._isContainesTargets(this._areProperelyNested(str))
  }
}

const clearTags = str => {
  let read = true
  let ns = ''
  for(let i = 0,l = str.length;i < l;i++){
    if(str[i] === '<') read = false
    if(read){
      if(str[i] !== ' ' && str[i] !== '\n') ns += str[i]
    }
    else{
      ns += str[i]
    }
    if(str[i] === '>') read = true
  }
  return ns
}



