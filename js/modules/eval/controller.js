'use strict'
//filter by var, print or formula
//landing page
//'use example' keyword => example.var - done
class EvalController extends App{
	constructor(){
    super()
    this._backup = new Backup(this._cg)
    this._autocomplete = new Autocomplete(this._config)
    
    this._UIcomponent = new EvalComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case Component.ONCLICK():
          new NotificationController().hide()
          switch(o.element.dataset.id){
            case Component.EXEC_BUTTON():
              this._exec()
            break
            case EvalComponent.MODE_BUTTON():
              this._switchMode()
            break
            case EvalComponent.LABEL_BUTTON():
              this._switchLabel()
            break
            case EvalComponent.CLEAR_HISTORY_BUTTON():
              this._clearHistory()
            break
            case EvalComponent.CLEAR_BUTTON():
              this._updateTextarea('')
            break
            case EvalComponent.ADD_BUTTON():
              new AddController()
            break
            case EvalComponent.TEXTAREA_ID():
              this._updateCaretLocation(o)
            break
            case EvalComponent.EVAL_BUTTON():
              this._switchEval()
            break
            case EvalComponent.FORWARD_BUTTON():
              this._forward()
            break
            case EvalComponent.BACKWARD_BUTTON():
              this._backward()
            break
            case EvalComponent.FILE_BUTTON():
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
        case Component.ONKEYUP():
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

              /*if(typeof this._config.autocomplete.find(a => a === 'new') === 'undefined'){
                this._config.autocomplete.push('new')
              }*/
            break
            case 'a-c':
              this._filterForAutocomplete(o.element.value)
            break
          }
        break
        case Component.ONPASTE():
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
    //console.log(this._autocomplete.getFiltered(this._config.autocomplete,str))
    new AutocompleteController(
      this._autocomplete.getFiltered(this._config.autocomplete,str),
      this._backup,
      str
    )
  }
  //if returns true, some error occured
  _testProgram(str){
    const tests = [
      new PairNestedTest(['(',')']),
      new QuotesTest('\'')
    ]
    const testString = removeOneLineComments(str)
    for(let i = 0,l = tests.length;i < l;i++){
      if(!tests[i].exec(testString)){
        return true
      }
    }
    return false
  }

  _testAndUpdateEntry(o){
    const CLASS_NAME = 'card__tr--error'
    if(this._testProgram(o.element.value)){
      o.element.classList.add(CLASS_NAME)
    }else{
      o.element.classList.remove(CLASS_NAME)
    }
  }

  _exec(){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    if(this._testProgram(ro.formula_entry)) return

    const runner = new Runner(ro.formula_entry)
    runner.onDoneCallback(r => {
      console.log('done')//hide spinner
      const error = r.interpreter.getError()
      const resultManager = new ResultManager(this._config.queue)
      if(error.length() !== 0){
        error.get().forEach(e => {
          new NotificationController()
          .setText(`${ e.ln } - ${ e.mess }`)
          .show()
        })

        resultManager.add({
          type:0,
          tree:new Marker().addError('Some error has occured!').get(),
          selected:true,
        })

      }else{
        const marker = r.interpreter.getMarker()
        if(marker.length !== 0){//if empty, don't add it
        resultManager.add({
            type:0,
            tree:marker,
            selected:false,
          })
        }
      }
      this._config.queue = resultManager.get()
      this._cg.save()//save & refresh UI
    })
    runner.onRunningCallback(r => {
      console.log('running')//show spinner
    })
    runner.run()
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

  _updateTextareaAfterCallBackup(){
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),{
      formula_entry:this._backup.getLast()
    })
    this._updateTextarea(this._backup.getLast(),false)
  }

  _forward(){
    this._backup.forward()
    this._updateTextareaAfterCallBackup()
  }

  _backward(){
    this._backup.backward()
    this._updateTextareaAfterCallBackup()
  }
}
