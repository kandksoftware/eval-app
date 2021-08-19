'use strict'

class Var{
  exec(tokens,variables,functions,error,marker){
    if(tokens.length >= 3){
      let loc = tokens.indexOf('=')
      if(loc !== -1){
        if(marker) marker.setLoc(`var ` + tokens.join(' '))
        const config = new Config().get()
        let leftSide = tokens.slice(0,loc)
        let rightSide = tokens.slice(loc + 1,tokens.length)
        const parser = new Parser(variables,error,marker)
        parser.setBuildInFunctions(functions.get())
        parser.setCustomFunctions(config.customFunctions)
        //asign or create
        const value = parser.exec(rightSide)
        variables.add({
          name:leftSide[0],
          value:value,
          type:Variables.typeof(value)
        })
      }
    }
  }
}