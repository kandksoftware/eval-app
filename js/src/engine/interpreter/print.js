'use strict'

class Print{
  exec(tokens,variables,functions,error,marker){
    let loc = tokens.indexOf('print')
    if(loc !== -1){
      let rightSide = tokens.slice(loc + 1,tokens.length)
      if(rightSide.length !== 0){
        if(marker) marker.setLoc(tokens.join(' '))
        const config = new Config().get()
        let rightSide = tokens.slice(loc + 1,tokens.length)
        const parser = new Parser(variables,error,marker)
        parser.setBuildInFunctions(functions.get())
        parser.setCustomFunctions(config.customFunctions)
        marker.addFinalResult(parser.exec(rightSide))
      }
    }
  }
}