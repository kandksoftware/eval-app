'use strict'

class Use{
  exec(tokens,variables,error){
    let loc = tokens.indexOf('use')
    if(loc !== -1){
      variables.removeScope()
      let rightSide = tokens.slice(loc + 1,tokens.length)
      if(rightSide.length === 0){
        error.add('Syntax error in \'use\' statement!')
      }else{
        if(rightSide.length === 1){
          variables.addScope(rightSide.join('/'))
        }else{
          let asLoc = rightSide.indexOf('as')
          if(asLoc !== -1){
            const l = rightSide.slice(0,asLoc)
            const r = rightSide.slice(asLoc + 1)
            variables.addScope(l.join(' '))
            variables.setType(r.join(' '))
          }else{
            error.add('Missing \'as\' keyword!')
          }
        }
      }
    }
  }
}