'use strict'

class EvalController extends App{
	constructor(){
    super()
    this._UIcomponent = new EvalComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          new NotificationController().hide()
          switch(o.element.dataset.id){
            case 'exec':
              this._exec()
            break
            case 'mode':
              this._switchMode()
            break
            case 'c-h':
              this._clearHistory()
            break
            case 'clear':
              this._updateTextarea('')
            break
            case 'config':
              new AddController()
            break
          }

          if(o.element.dataset.funid){
            this._addCustomFactor(o.element.dataset.funid)
          }else if(o.element.dataset.varid){
            this._addCustomFactor(o.element.dataset.varid)
          }else if(o.element.dataset.operid){
            this._addCustomFactor(o.element.dataset.operid)
          }
        break
        case 'onkeyup':
          switch(o.element.dataset.id){
            case 'formula_entry':
              const CLASS_NAME = 'card__tr--error'
              if(isOpenBracket(o.element.value)){
                o.element.classList.add(CLASS_NAME)
              }else{
                o.element.classList.remove(CLASS_NAME)
              }

              this._updateTextarea(
                o.element.value,
                false
              )
            break
          }
        break
      }
    })
  }

  _exec(){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    const str = ro.formula_entry
    this._execCalculator((m,r) => {
      if(m === 0){
        this._config.textarea = r.result
        if(r.results.get().length !== 0){
          this._config.results.push(r.results.get())
        }else{
          this._config.results.push(new Marker().addResult([str]).addResult([r.result]).get())
        }
      }else{
        this._config.results.push(new Marker().addError('Some error has occured!',str).get())
      }
      this._cg.save()
    })
  }

  _updateTextarea(str,listen = true){
    this._config.textarea = str
    this._cg.save(listen)
  }

  _execCalculator(callback){
    const calc = new Calculator()
    const ro = this._UIcomponent.getDataValueFrom(EvalComponent.VIEW_ID())
    const str = ro.formula_entry
    if(str.length !== 0){
      if(isOpenBracket(str)){
        callback(1)
      }else{
        const co = calc.exec(str)
        
        if(co.error.isError()){
          callback(1,co)
        }else{
          callback(0,co)
        }
      }
    }
  }

  _clearHistory(){
    this._config.results = []
    this._cg.save()
    new NotificationController()
    .setText('The history has been deleted')
    .show(NotificationComponent.INFO())
  }

  _switchMode(){
    this._config.modeDeg =! this._config.modeDeg
    this._cg.save()
    new NotificationController()
    .setText(`You have selected ${ this._config.modeDeg ? 'degree' : 'radius'} mode!`)
    .show(NotificationComponent.INFO())
  }

  _addCustomFactor(name){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    ro.formula_entry += name
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),ro)
    this._updateTextarea(ro.formula_entry)
  }
}
