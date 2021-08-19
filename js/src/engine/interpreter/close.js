'use strict'

class Close{
  exec(tokens,variables,functions,error,marker){
    let loc = tokens.indexOf('close')
    if(loc !== -1){
      variables.removeScope()
    }
  }
}