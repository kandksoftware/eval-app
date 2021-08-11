'use strict'

class Limiter{
  static isNumber(t){
    return t >= 0 && t <= 9
  }

  static alert(n){
    let counter = 0
    
    for(let i = 0,length = n.length;i < length;i++){
      if(Limiter.isNumber(n.charAt(i))) counter++
      if(counter > 8) return true
    }
    return false
  }

  static exec(n){
    let counter = 0
    let ns = ''
    
    for(let i = 0,length = n.length;i < length;i++){
      if(Limiter.isNumber(n.charAt(i))) counter++

      if(counter > 8) return ns
      ns += n.charAt(i)
    }
    return ns
  }
}