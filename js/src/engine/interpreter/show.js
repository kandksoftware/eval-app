'use strict'

class Show{
  exec(tokens,variables,functions,error,marker){
    let loc = tokens.indexOf('show')
    if(loc !== -1){
      let rightSide = tokens.slice(loc + 1,tokens.length)
      if(rightSide.length !== 0){
        //console.log(variables.getByScope(rightSide.join(' ')))
        const cg = new Config()
        const config = cg.get()
        config.scope = rightSide.join(' ')
        cg.save(false)
        new GraphicsController()
      }
    }
  }
}