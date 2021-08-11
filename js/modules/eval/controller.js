'use strict'
//show/hide labes - done
//comments - done
//save programs - done
//filter by var, print or formula
//save carret location - done
//backup <= | => - done
//landing page
//fake thread
//diagram
//'use example' keyword => example.var - done
//statistics functions
class EvalController extends App{
	constructor(){
    super()
    this._backup = new Backup(50,this._cg)
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
            case 'formula_entry':
              this._updateCaretLocation(o)
              this._addCustomFactor(name = '')
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
          }

          if(o.element.dataset.funid){
            this._addCustomFactor(o.element.dataset.funid)
          }else if(o.element.dataset.varid){
            this._addCustomFactor(o.element.dataset.varid)
          }else if(o.element.dataset.operid){
            this._addCustomFactor(o.element.dataset.operid)
          }else if(o.element.dataset.useid){
            this._pipe(o.element.dataset.useid)
          }else if(o.element.dataset.deleteid){
            this._deleteCard(o.element.dataset.deleteid)
          }else if(o.element.dataset.selectid){
            this._selectCard(o.element.dataset.selectid)
          }
        break
        case 'onkeyup':
          switch(o.element.dataset.id){
            case 'formula_entry':
              this._backup.add(o.element.value)//add to the backup
              this._testAndUpdateEntry(o)
              this._updateCaretLocation(o)
            break
          }
        break
        case 'onpaste':
          switch(o.element.dataset.id){
            case 'formula_entry':
              this._backup.add(o.element.value)//add to the backup
            break
          }
          this._testAndUpdateEntry(o)
        break
      }
    })
  }

  _testAndUpdateEntry(o){
    const CLASS_NAME = 'card__tr--error'
    if(new PairNestedTest(['(',')']).exec(o.element.value)){
      o.element.classList.remove(CLASS_NAME)
    }else{
      o.element.classList.add(CLASS_NAME)
    }
    this._updateTextarea(o.element.value,false)
  }

  _exec(){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
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
        this._config.results.push({
          tree:runner.getMarker(),
          selected:false,
        })
      }
    }else{
      this._config.results.push({
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

  _switchLabel(){
    this._config.showLabel =! this._config.showLabel
    this._cg.save()
    
    new NotificationController()
    .setText(`You have selected ${ this._config.showLabel ? 'on' : 'off'} mode!`)
    .show(NotificationComponent.INFO())
  }

  _addCustomFactor(name){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    const left = ro.formula_entry.slice(0,this._config.textarea.caret)
    const right = ro.formula_entry.slice(this._config.textarea.caret)
    const str = left + name + right
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),{
      formula_entry:str
    })
    const ms = left + name
    this._config.textarea.default = str
  }

  _deleteCard(id){
    this._config.results = this._config.results.filter((r,i) => i !== +id)
    this._cg.save()
  }

  _selectCard(id){
    this._config.results.forEach((r,i,arr) => {
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
