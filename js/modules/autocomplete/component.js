'use stricy'

class AutocompleteComponent extends EvalComponent{
  constructor(filtered){
    super()
    this._filtered = filtered
    this._viewId = $('a-f')
  }

  static VIEW_ID(){
    return 'autocomplete'
  }

  render(){
    this._viewId.innerHTML = `<div class="${ Component.GROUP() }" id="${ AutocompleteComponent.VIEW_ID() }">
                                ${ this._addFunctionTemplate() }
                              </div>`
  }

  _addFunctionTemplate(){
    return `<div class="card__btns card__btns--overflow-horizontal">${ this._filteredTemplate(this._filtered) }
            </div>`
  }

  _filteredTemplate(filtered){
    if(filtered.length !== 0){
      return filtered.map(cf => `<button class="btn btn--color-stand btn--marg-right ${ Component.ONCLICK() }" data-fid="${ cf }">${ cf }</button>`).join('')
    }
    return `<span class="a-f__no-found">No found!</span>`
  }
}