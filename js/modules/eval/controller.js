'use strict'
//filter by var, print or formula
//landing page
//fake thread
//diagram
//'use example' keyword => example.var - done
//statistics functions
class EvalController extends App{
	constructor(){
    super()
    this._backup = new Backup(this._cg)
    this._autocomplete = new Autocomplete(this._config)
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
            case 'label':
              this._switchLabel()
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
            case EvalComponent.TEXTAREA_ID():
              this._updateCaretLocation(o)
              //this._addCustomFactor(name = '')
            break
            case 'eval':
              this._switchEval()
            break
            case 'forward':
              this._forward()
            break
            case 'backward':
              this._backward()
            break
            case 'file':
              new FileController()
            break
            case 'templates':
              
            break
          }

          if(o.element.dataset.deleteid){
            this._deleteCard(o.element.dataset.deleteid)
          }else if(o.element.dataset.selectid){
            this._selectCard(o.element.dataset.selectid)
          }
        break
        case 'onkeyup':
          switch(o.element.dataset.id){
            case EvalComponent.TEXTAREA_ID():
              this._backup.add(o.element.value)//add to the backup
              this._testAndUpdateEntry(o)
              this._updateCaretLocation(o)
              this._updateTextarea(o.element.value,false)

              this._filterForAutocomplete(this._autocomplete.exec(
                CARET.getInputSelection(o.element).start,
                o.element.value
              ))
            break
            case 'a-c':
              this._filterForAutocomplete(o.element.value)
            break
          }
        break
        case 'onpaste':
          switch(o.element.dataset.id){
            case EvalComponent.TEXTAREA_ID():
              this._backup.add(o.element.value)//add to the backup
            break
          }
          this._testAndUpdateEntry(o)
        break
      }
    })
  }

  _filterForAutocomplete(str){
    let array = this._config.inBuildFunction.map(f => { return {name:f,args:['x']}})
    array = array.concat(this._config.customFunctions)
    array = array.map(a => COMPOSE_FUNCTION_ID(a))
    array = array.concat(this._config.variables.map(v => v.name))
    array = array.concat(['print','show','use','object','diagram','@title','@maxValue'])
    array = array.concat(this._config.operators)
    array = this._autocomplete.getFiltered(array,str)
    new AutocompleteController(array,this._backup,str)
  }

  _testAndUpdateEntry(o){
    const tests = [
      new PairNestedTest(['(',')']),
      new QuotesTest('\'')
    ]
    const CLASS_NAME = 'card__tr--error'

    for(let i = 0,l = tests.length;i < l;i++){
      if(tests[i].exec(o.element.value)){
        o.element.classList.remove(CLASS_NAME)
      }else{
        o.element.classList.add(CLASS_NAME)
        return
      }
    }
  }

  _exec(){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    if(!new PairNestedTest(['(',')']).exec(ro.formula_entry)) return
    if(!new QuotesTest('\'').exec(ro.formula_entry)) return
    
    const runner = new Runner()
    runner.exec(ro.formula_entry,
    e => {
      new NotificationController()
      .setText(`${ e.ln } - ${ e.mess }`)
      .show()
    })

    const e = runner.getErrorMess()

    if(e.length === 0){
      const marker = runner.getMarker()
      if(marker.length !== 0){//if empty, don't add it
        this._config.queue.push({
          type:0,
          tree:marker,
          selected:false,
        })
      }
    }else{
      this._config.queue.push({
        type:0,
        tree:new Marker().addError('Some error has occured!').get(),
        selected:true,
      })
    }
    this._cg.save()
  }

  _updateTextarea(str,listen = true){
    this._config.textarea.default = str
    this._cg.save(listen)
  }

  _clearHistory(){
    this._config.queue = []
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

  _switchLabel(){
    this._config.showLabel =! this._config.showLabel
    this._cg.save()
    
    new NotificationController()
    .setText(`You have selected ${ this._config.showLabel ? 'on' : 'off'} mode!`)
    .show(NotificationComponent.INFO())
  }

  _deleteCard(id){
    this._config.queue = this._config.queue.filter((r,i) => i !== +id)
    this._cg.save()
  }

  _selectCard(id){
    this._config.queue.forEach((r,i,arr) => {
      if(i === +id){
        arr[i].selected =! arr[i].selected
        return arr[i]
      }
    })
    this._cg.save()
  }

  _updateCaretLocation(o){
    const caret = CARET.getInputSelection(o.element)
    this._config.textarea.caret = caret.start
    this._cg.save(false)//don't update UI
  }

  _switchEval(){
    this._config.showEval =! this._config.showEval
    this._cg.save()
    
    new NotificationController()
    .setText(`You have selected ${ this._config.showEval ? 'on' : 'off'} mode!`)
    .show(NotificationComponent.INFO())
  }

  _forward(){
    this._backup.forward()
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),{
      formula_entry:this._backup.getLast()
    })
    this._updateTextarea(this._backup.getLast(),false)
  }

  _backward(){
    this._backup.backward()
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),{
      formula_entry:this._backup.getLast()
    })
    this._updateTextarea(this._backup.getLast(),false)
  }
}
