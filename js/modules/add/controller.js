'use strict'

class AddController extends App{
	constructor(){
    super()
    this._UIcomponent = new AddComponent()
    this._UIcomponent.refresh()
    this._functions = this._config.customFunctions
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case 'save-function':
                this._saveFunction()
              break
              case 'save-constant':
                this._saveConstant()
              break
              case 'cancel':
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
      }
    })
  }

  _getFunctionData(){
    const inputs = this._UIcomponent.getDataValueFrom(AddComponent.FUNCTION_TEMPLATE())
    const calc = new Calculator(false)
    return {
      name:trim(inputs.name),
      args:inputs.args.split(' ').map(a => trim(a)),
      body:calc.prepare(inputs.body)
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
    this._cg.save()

    new NotificationController()
    .setText('The function has been deleted')
    .show(NotificationComponent.INFO())
  }

  _readFunction(id){
    const f = this._config.customFunctions.find(f => COMPOSE_FUNCTION_ID(f) === id)
    if(typeof f !== 'undefined'){
      this._UIcomponent.setDataValueTo(ConfigComponent.FUNCTION_TEMPLATE(),customFunctionModel(f))
    }else{
      new NotificationController()
      .setText('Some error occured!')
      .show()
    }
  }

  _saveConstant(){
    const inputs = this._UIcomponent.getDataValueFrom(AddComponent.CONSTANT_TEMPLATE())
    const nc = {
      name:trim(inputs.name),
      value:inputs.value,
    }

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
    this._cg.save()
    new NotificationController()
    .setText('The constant has been deleted')
    .show(NotificationComponent.INFO())
  }
}
