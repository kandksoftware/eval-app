'use strict'

class BuildInFunctions{
  constructor(config = null,variables = null){
    this._config = config
    this._variables = variables
  }
  
  static rond(arg){
    switch(arg){
      case 0:
      case 90:
      case 180:
      case 270:
      case 360:
        return arg - 0.001
      break
    }
    return arg
  }

  getValuesFromObject(arg){
    return this._variables !== null ? this._variables.getByScope(arg,false).map(v => +v.value) : []
  }
  
  get(){
    const selected = this._config !== null ? this._config.get().modeDeg : true
    return [{
      name:'tanh',
      body:arg => selected ? Math.tanh(arg * Math.PI / 180) : Math.tanh(arg)
    },{
      name:'sinh',
      body:arg => selected ? Math.sinh(arg * Math.PI / 180) : Math.sinh(arg)
    },{
      name:'cosh',
      body:arg => selected ? Math.cosh(arg * Math.PI / 180) : Math.cosh(arg)
    },{
      name:'atan',
      body:arg => selected ? Math.atan(arg) * 180 / Math.PI : Math.atan(arg)
    },{
      name:'asin',
      body:arg => selected ? Math.asin(arg) * 180 / Math.PI : Math.asin(arg)
    },{
      name:'acos',
      body:arg => selected ? Math.acos(arg) * 180 / Math.PI : Math.acos(arg)
    },{
      name:'atanh',
      body:arg => selected ? Math.atanh(arg * Math.PI / 180) : Math.atanh(arg)
    },{
      name:'asinh',
      body:arg => selected ? Math.asinh(arg * Math.PI / 180) : Math.asinh(arg)
    },{
      name:'acosh',
      body:arg => selected ? Math.acosh(arg * Math.PI / 180) : Math.acosh(arg)
    },{
      name:'cos',
      body:arg => selected ? Math.cos(arg * Math.PI / 180) : Math.cos(arg)
    },{
      name:'sin',
      body:arg => selected ? Math.sin(arg * Math.PI / 180) : Math.sin(arg)
    },{
      name:'tan',
      body:arg => selected ? Math.tan(arg * Math.PI / 180) : Math.tan(arg)
    },{
      name:'abs',
      body:arg => Math.abs(arg)
    },{
      name:'round',
      body:arg => Math.round(arg)
    },{
      name:'ln',
      body:arg => Math.log(arg)
    },{
      name:'log',
      body:arg => Math.log10(arg)
    },{
      name:'exp',
      body:arg => Math.exp(arg)
    },{
      name:'avg',
      body:arg => {
        const values = this.getValuesFromObject(arg)
        return values.length === 0 ? null : MArray.avg(values)
      }
    },{
      name:'max',
      body:arg => {
        const values = this.getValuesFromObject(arg)
        return values.length === 0 ? null : MArray.max(values)
      }
    },{
      name:'min',
      body:arg => {
        const values = this.getValuesFromObject(arg)
        return values.length === 0 ? null : MArray.min(values)
      }
    },{
      name:'median',
      body:arg => {
        const values = this.getValuesFromObject(arg)
        return values.length === 0 ? null : MArray.median(values)
      }
    }]
  }
}