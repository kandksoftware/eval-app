'use strict'

class SettingsController extends App{
	constructor(){
    super()
    this._UIcomponent = new SettingsComponent()
    this._UIcomponent.refresh()
    this._UIcomponent.attach(Component.VIEW_ID(),o => {
      switch(o.event.name){
        case Component.ONCLICK():
          if(typeof o.element.dataset.id !== 'undefined'){
            switch(o.element.dataset.id){
              case SettingsComponent.DAF_BUTTON():
                this._clearFunctions()
              break
              case SettingsComponent.DAC_BUTTON():
                this._clearConstants()
              break
              case SettingsComponent.DELETE_HISTORY_BUTTON():
                this._clearHistory()
              break
              case SettingsComponent.DELETE_ALL_SETTING_BUTTON():
                this._clearAllSettings()
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

  _clearHistory(){
    this._config.results = []
    this._cg.save()
    this._notificationTemplate('The history has been deleted')
  }

  _clearFunctions(){
    this._config.customFunctions = []
    this._cg.save()
    this._notificationTemplate('The functions has been deleted')
  }

  _clearConstants(){
    this._config.variables = this._config.variables.filter(v => {
      if(this._config.inBuildConstants.includes(v.name)){
        return v
      }
    })
    this._cg.save()
    this._notificationTemplate('The constants has been deleted')
  }

  _clearAllSettings(){
    this._clearHistory()
    this._clearFunctions()
    this._clearConstants()
    this._notificationTemplate('The applications has been restored')
  }

  _notificationTemplate(str){
    new NotificationController()
    .setText(str)
    .show(NotificationComponent.INFO())
  }
}
