//ready-to-use program templates
function main(){
  'use strict'
  const cg = new Config()
  const config = cg.get()
  
  if(config.init){
    let consts = [{
      name:'PI',
      value:3.141592653589793,
    },{
      name:'E',
      value:2.71828,
    },{
      name:'TRUE',
      value:1,
    },{
      name:'FALSE',
      value:0,
    }]
    
    config.variables = consts.map(c => {//init build-in constants
      return {
        name:c.name,
        value:c.value,
        type:Variables.NUMBER(),
        scope:''
      }
    })

    config.inBuildConstants = consts.map(c => c.name)
    //init build-in functions
    config.inBuildFunction = new BuildInFunctions().get().map(f => f.name)
    //init autocomplete
    initAutocomplete(config)
    //save init
    config.init = false
    cg.save()
  }

  new MenuController()
  new EvalController()

  $('splash-screen').classList.add('hide')//hide a splash screen after full initiation
}












