'use strict'

class Show{
  exec(tokens,variables,functions,error,marker){
    let loc = tokens.indexOf('show')
    if(loc !== -1){
      let rightSide = tokens.slice(loc + 1,tokens.length)
      if(rightSide.length !== 0){
        const cg = new Config()
        const config = cg.get()
        
        config.queue.push({
          type:1,
          variables:variables.getByScope(rightSide.join(' ')),
          selected:false,
        })
        cg.save(false)
      }
    }
  }
}