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
            const l = rightSide.slice(0,asLoc).join(' ')
            const r = rightSide.slice(asLoc + 1).join(' ')
            variables.add({
              name:l,
              value:'this',
              type:Variables.OBJECT(),
              scope:r
            })
            variables.setScope(l)
            this._initLib(r,variables,error)
          }else{
            error.add('Missing \'as\' keyword!')
          }
        }
      }
    }
  }

  _initLib(name,variables,error){
    const libs = [{
      name:'diagram',
      initVars:[{
        name:'@maxValue',
        value:100
      }/*,{
        name:'@title',
        value:'Diagram'
      }*/]
    },{
      name:'object',
      initVars:[]
    }]

    const ff = libs.find(f => f.name === name)
    if(typeof ff !== 'undefined'){
      ff.initVars.forEach(iv => variables.add(iv))
      //variables.setType(name)
    }else{
      error.add('Library not found!')
    }
  }
}