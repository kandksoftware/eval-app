'use strict'

class SuperComponent extends Component{
  constructor(){
    super()
    this._cg.attach(Observer.UPDATE(),() => this.refresh())
    this._viewId = $('entry')
  }
}