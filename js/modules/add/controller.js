'use strict'
//need to add autocomplate system for the constants & functions
//check if argument name is same as constant or function
//check if function body is parceble
class AddController extends App{
	constructor(){
    super()
    this._functions = this._config.customFunctions
    
    this._UIcomponent = new AddComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case Component.ONCLICK():
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case AddComponent.SAVE_FUNCTION_BUTTON():
                this._saveFunction()
              break
              case AddComponent.SAVE_CONSTANT_BUTTON():
                this._saveConstant()
              break
              case Component.RETURN_BUTTON():
                new EvalController()
                new NotificationController().hide()
              break
            }
          }else if(typeof o.element.dataset.funid !== 'undefined'){
            this._readFunction(o.element.dataset.funid)
          }else if(typeof o.element.dataset.fundelid !== 'undefined'){
            this._deleteFunction(o.element.dataset.fundelid)
          }else if(typeof o.element.dataset.varid !== 'undefined'){
            this._readConstant(o.element.dataset.varid)
          }else if(typeof o.element.dataset.vardelid !== 'undefined'){
            this._deleteConstant(o.element.dataset.vardelid)
          }
        break
        case Component.ONKEYUP():
          switch(o.element.dataset.id){
            case AddComponent.ARGS_INPUT():
              this._checkFunctionArgsOnTheFly(o)
            break
            case AddComponent.FUNCTION_BODY_INPUT():
              this._checkFunctionBodyOnTheFly(o)
            break
            case AddComponent.VALUE_INPUT():
              this._checkConstValueOnTheFly(o)
            break
          }
        break
      }
    })
  }
  //Might be used to test variables and custom funtions
  _testCustom(v,c){
    return typeof c.find(cus => cus.name === v) !== 'undefined'
  }

  _testInput(o,r = true){
    const className = 'card__tr--error'
    if(r){
      o.element.classList.add(className)
      return
    }else{
      o.element.classList.remove(className)
      return
    }
  }

  _checkFunctionArgsOnTheFly(o){
    const fd = this._getFunctionData()
    const args = fd.args
    for(let i = 0,l = args.length;i < l;i++){
      this._testInput(o,false)
      if(this._config.inBuildFunction.includes(args[i])){
        this._testInput(o)
      }else if(this._testCustom(args[i],this._config.variables)){
        this._testInput(o)
      }else if(this._testCustom(args[i],this._config.customFunctions)){
        this._testInput(o)
      }else if(args.includes(fd.name)){//the argument name must be different from the function name
        this._testInput(o)
      }
    }
  }

  _checkFunctionBodyOnTheFly(o){
    const fd = this._getFunctionData()
    this._testInput(o,false)
    if(fd.body.includes(fd.name)){
      this._testInput(o)
    }
  }

  _checkConstValueOnTheFly(o){
    const value = this._getConstData().value
    this._testInput(o,false)
    if(isNaN(value)){
      this._testInput(o)
    }
  }

  _getFunctionData(){
    const inputs = this._UIcomponent.getDataValueFrom(AddComponent.FUNCTION_TEMPLATE())
    const calc = new Calculator(false)
    return {
      name:trim(inputs.name),
      args:inputs.args.split(' ').map(a => trim(a)),
      body:calc.prepare(inputs[AddComponent.FUNCTION_BODY_INPUT()])
    }
  }

  _saveFunction(){
    const nf = this._getFunctionData()
    const functions = this._config.customFunctions

    if(typeof this._config.inBuildFunction.find(c => c === nf.name) !== 'undefined'){
      new NotificationController()
      .setText('Cannot override build-in function!')
      .show()
      return
    }

    if(typeof functions.find(v => COMPOSE_FUNCTION_ID(v) === COMPOSE_FUNCTION_ID(nf)) !== 'undefined'){//update
      new NotificationController()
      .setText('Function has been updated')
      .show(NotificationComponent.INFO())
      functions.forEach((v,i,arr) => {
        if(COMPOSE_FUNCTION_ID(v) === COMPOSE_FUNCTION_ID(nf)){
          arr[i] = nf
        }
      })
    }else{//create
      new NotificationController()
      .setText('Function has been created')
      .show(NotificationComponent.INFO())
      functions.push(nf)
    }
    //update autocomplete
    this._updateAutocomplete()
    this._cg.save()
  }

  _deleteFunction(id){
    if(typeof this._config.inBuildFunction.find(c => c === id) !== 'undefined'){
      new NotificationController()
      .setText('Cannot override build-in function!')
      .show()
      return
    }

    this._config.customFunctions = this._config.customFunctions.filter(v => COMPOSE_FUNCTION_ID(v) !== id)
    //update autocomplete
    this._updateAutocomplete()
    this._cg.save()

    new NotificationController()
    .setText('The function has been deleted')
    .show(NotificationComponent.INFO())
  }

  _readFunction(id){
    const f = this._config.customFunctions.find(f => COMPOSE_FUNCTION_ID(f) === id)
    if(typeof f !== 'undefined'){
      this._UIcomponent.setDataValueTo(AddComponent.FUNCTION_TEMPLATE(),customFunctionModel(f))
    }else{
      new NotificationController()
      .setText('Some error occured!')
      .show()
    }
  }

  _getConstData(){
    const inputs = this._UIcomponent.getDataValueFrom(AddComponent.CONSTANT_TEMPLATE())
    return{
      name:trim(inputs.name).toUpperCase(),
      value:inputs.value,
    }
  }

  _saveConstant(){
    const nc = this._getConstData()
    if(nc.name.length === 0) return
    nc.type = Variables.NUMBER()
    nc.scope = ''

    if(typeof this._config.inBuildConstants.find(c => c === nc.name) !== 'undefined'){
      new NotificationController()
      .setText('Cannot override build-in constants!')
      .show()
      return
    }

    const variables = this._config.variables
    if(typeof variables.find(v => v.name === nc.name) !== 'undefined'){//update
      new NotificationController()
      .setText('Constant updated')
      .show(NotificationComponent.INFO())
      variables.forEach((v,i,arr) => {
        if(v.name === nc.name){
          arr[i] = nc
        }
      })
    }else{//create
      new NotificationController()
      .setText('Constant created')
      .show(NotificationComponent.INFO())
      variables.push(nc)
    }
    //update autocomplete
    this._updateAutocomplete()
    
    this._cg.save()
  }

  _readConstant(name){
    const v = this._config.variables.find(v => v.name === name)
    if(typeof v !== 'undefined'){
      const inputs = this._UIcomponent.setDataValueTo(AddComponent.CONSTANT_TEMPLATE(),{
        name:v.name,
        value:v.value
      })
    }else{
      new NotificationController()
      .setText('Some error occured!')
      .show()
    }
  }

  _deleteConstant(name){
    if(typeof this._config.inBuildConstants.find(c => c === name) !== 'undefined'){
      new NotificationController()
      .setText('Cannot delete build-in constant!')
      .show()
      return
    }

    this._config.variables = this._config.variables.filter(c => c.name !== name)
    //update autocomplete
    this._updateAutocomplete()
    this._cg.save()
    new NotificationController()
    .setText('The constant has been deleted')
    .show(NotificationComponent.INFO())
  }

  _updateAutocomplete(){
    initAutocomplete(this._config)
  }
}
