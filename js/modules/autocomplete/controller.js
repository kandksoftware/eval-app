'use strict'

class AutocompleteController extends App{
	constructor(filtered,backup,str){
    super()
    this._backup = backup
    this._filtered = filtered
    this._str = str
    this._UIcomponent = new AutocompleteComponent(this._filtered)
    this._UIcomponent.refresh()
    this._UIcomponent.attach(AutocompleteComponent.VIEW_ID(),o => {
      switch(o.event.name){
        case 'onclick':
          if(o.element.dataset.fid){
            this._addCustomFactor(o.element.dataset.fid)
          }
        break
      }
    })
  }

  _addCustomFactor(name){
    const ro = this._UIcomponent.getDataValueFrom(Component.VIEW_ID())
    const left = ro.formula_entry.slice(0,this._config.textarea.caret - this._str.length)
    const right = ro.formula_entry.slice(this._config.textarea.caret)
    let str = ''
    let space = 0
    if(right[0] === ')') str = left + name + right
    else{
      str = left + name + ' ' + right
      space = 1
    }
    this._UIcomponent.setDataValueTo(Component.VIEW_ID(),{
      formula_entry:str
    })
    const caret = left.length + name.length + space//add addtional space
    CARET.setCaretToPos($(EvalComponent.TEXTAREA_ID()),caret)
    this._config.textarea.caret = caret
    this._config.textarea.default = str
    this._cg.save(false)//don't update UI
    this._backup.add(str)
  }
}
