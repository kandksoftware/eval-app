'use stricy'

class AddComponent extends SuperComponent{
  constructor(){
    super()
  }

  static FUNCTION_TEMPLATE(){
    return 'add-function'
  }

  static CONSTANT_TEMPLATE(){
    return 'add-constant'
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
                                ${ this._addFunctionTemplate() }
                                ${ this._addConstantTemplate() }
                              </div>`
  }

  _addFunctionTemplate(){
    return `<div class="card card--entry" id="${ AddComponent.FUNCTION_TEMPLATE() }">
              <h1 class="card__title">Add function</h1>
              <label class="card__label">Name</label>
              <input class="card__input set get" type="text" data-id="name" value="salary"/>
              <label class="card__label">Arguments</label>
              <input class="card__input set get onkeyup" type="text" data-id="args" value="daily days"/>
              <label class="card__label">Function body</label>
              <input class="card__input set get" type="text" data-id="body" value="daily * days"/>
              <div class="card__btns card__btns--to-right">
                <button data-id="cancel" class="btn btn--color-stand onclick">Back</button>
                <button data-id="save-function" class="btn btn--color-stand onclick">Save</button>
              </div>
              <div class="card__btns card__btns--overflow-horizontal">${ this._buildButtonTemplate(this._config.customFunctions,this._functionTemplate) } 
              </div>
            </div>`
  }

  _addConstantTemplate(){
    return `<div class="card card--entry" id="${ AddComponent.CONSTANT_TEMPLATE() }">
              <h1 class="card__title">Add Constant</h1>
              <label class="card__label">Name</label>
              <input class="card__input set get uppercase" type="text" data-id="name" value="PI"/>
              <label class="card__label">Value</label>
              <input class="card__input set get onkeyup" type="text" data-id="value" value="3.14"/>
              <div class="card__btns card__btns--to-right">
                <button data-id="cancel" class="btn btn--color-stand onclick">Back</button>
                <button data-id="save-constant" class="btn btn--color-stand onclick">Save</button>
              </div>
              <div class="card__btns card__btns--overflow-horizontal">${ this._buildButtonTemplate(this._config.variables,this._constantTemplate) } 
              </div>
            </div>`
  }

  _buildButtonTemplate(array,template){
    if(array.length !== 0){
      return array.map(template).join('')
    }
    return this._emptyTemplate()
  }

  _functionTemplate(o){
    return `<div class="fun">
              <button class="onclick" data-funid="${ COMPOSE_FUNCTION_ID(o) }">
                ${ COMPOSE_FUNCTION_ID(o) }
              </button>
              <button class="onclick" data-fundelid="${ COMPOSE_FUNCTION_ID(o) }">
                &#10060;
              </button>
            </div>`
  }

  _constantTemplate(o){
    return `<div class="fun">
              <button class="onclick" data-varid="${ o.name }">
                ${ o.name }
              </button>
              <button class="onclick" data-vardelid="${ o.name }">
                &#10060;
              </button>
            </div>`
  }

  _emptyTemplate(){
    return `<span>Still empty!</span>`
  }

  _ifNotEmptyArray(array,callback){
    if(array.length !== 0){
      callback(array.slice(array.length - 1)[0])
    }
  }

  refresh(){
    super.refresh()

    this._ifNotEmptyArray(this._config.customFunctions,a => {
      this.setDataValueTo(AddComponent.FUNCTION_TEMPLATE(),customFunctionModel(a))
    })

    this._ifNotEmptyArray(this._config.variables,a => {
      this.setDataValueTo(AddComponent.CONSTANT_TEMPLATE(),customConstantModel(a))
    })
  }
}