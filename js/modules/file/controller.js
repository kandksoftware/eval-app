'use strict'

class FileController extends App{
	constructor(){
    super()
    this._backup = new Backup(this._cg)
    this._UIcomponent = new FileComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case Component.ONCLICK():
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case FileComponent.IMPORT_BUTTON():
                this._import()
              break
              case FileComponent.EXPORT_BUTTON():
                this._export()
              break
              case Component.RETURN_BUTTON():
                new EvalController()
              break
            }
          }
        break
      }
    })
  }

  _import(){
    open(d => {
      this._backup.add(d.content)
      this._config.textarea.default = d.content
      this._cg.save()
    })
  }

  _export(){
    const ro = this._UIcomponent.getDataValueFrom(FileComponent.EXPORT_TEMPLATE())
    save(() => ({
      data:ro.formula_entry,
      fileName:ro.file_name + '.txt'
    }))
  }
}
