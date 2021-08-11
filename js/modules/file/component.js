'use stricy'

class FileComponent extends SuperComponent{
  constructor(){
    super()
  }

  static EXPORT_TEMPLATE(){
    return 'export'
  }

  render(){
    this._viewId.innerHTML = `<div class="group" id="${ Component.VIEW_ID() }">
                                ${ this._exportTemplate() }
                                ${ this._importTemplate() }
                              </div>`
  }

  _importTemplate(){
    return `<div class="card card--entry">
              <h1 class="card__title">Import</h1>
              <div class="card__btns card__btns--to-right">
                <button data-id="back" class="btn btn--color-stand onclick">Back</button>
                <button data-id="import" class="btn btn--color-stand onclick">Import</button>
              </div>
            </div>`
  }

  _exportTemplate(){
    return `<div class="card card--entry" id="${ FileComponent.EXPORT_TEMPLATE() }">
              <h1 class="card__title">Export</h1>
              <label class="card__feature-name">File title</label>
              <input type="text" class="get set card--input" data-id="file_name"/>
              <label class="card__feature-name">Code</label>
              <textarea autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" class="card__tr card--input get set onkeyup onpaste onclick" data-id="formula_entry" placeHolder="Insert your formula here...">${ this._config.textarea.default }</textarea>
              <div class="card__btns card__btns--to-right">
                <button data-id="back" class="btn btn--color-stand onclick">Back</button>
                <button data-id="export" class="btn btn--color-stand onclick">Export</button>
              </div>
            </div>`
  }
}