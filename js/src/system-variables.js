'use strict'
class SystemTimer{//#3001
  constructor(){
    this.startTime = Date.now()

    if (!SystemTimer._instance) {
      SystemTimer._instance = this
    }
    return SystemTimer._instance
  }

  setTimer(value/* */){
    this.startTime = Date.now() - value
  }

  getTimer(){
    var elapsedTime = Date.now() - this.startTime
    const time = (elapsedTime / 1).toFixed(3)
    if(time > 2147483648) this.setTimer(0)
    return time
  }
}

class SystemDate{//#3011
  constructor(){
    this.date = new Date()
  }

  convertToTwoDigits(number){
    if(number < 10) return `0${ number }`
    return number
  }
  
  getMonth(){
    return this.date.getMonth() + 1
  }

  getDay(){
    return this.date.getDate()
  }

  getYear(){
    return this.date.getFullYear()
  }

  getDate(){
    return `${ this.getYear() }${ this.convertToTwoDigits(this.getMonth()) }${ this.convertToTwoDigits(this.getDay()) }`
  }
}

class SystemTime extends SystemDate{//#3012
  constructor(){
    super()
  }

  getSeconds(){
    return this.date.getSeconds()
  }

  getMinutes(){
    return this.date.getMinutes()
  }

  getHours(){
    return this.date.getHours()
  }

  getTime(){
    return `${ this.convertToTwoDigits(this.getHours()) }${ this.convertToTwoDigits(this.getMinutes()) }${ this.convertToTwoDigits(this.getSeconds()) }`
  }
}

class Modal{
  constructor(){
    this.init()
    this.main = true
  }

  init(){
    //Fanuc 0/16/18/20?/21
    this.groupI = [{
      code:1,
      commands:['G0','G00','G1','G01','G2','G02','G3','G03','G33']
    },{
      code:2,
      commands:['G17','G18','G19']
    },{
      code:3,
      commands:['G90','G91']
    },{
      code:4,
      commands:['G22','G23']
    },{
      code:5,
      commands:['G93','G94','G95']
    },{
      code:6,
      commands:['G20','G21']
    },{
      code:7,
      commands:['G40','G41','G42']
    },{
      code:8,
      commands:['G43','G44','G45']
    },{
      code:9,
      commands:['G73','G74','G76','G80','G81','G82','G83','G84','G85','G86','G87','G88','G89']
    },{
      code:10,
      commands:['G98','G99']
    },{
      code:11,
      commands:['G50','G51']
    },{
      code:12,
      commands:['G65','G66','G67']
    },{
      code:13,
      commands:['G96','G97']
    },{
      code:14,
      commands:['G54','G55','G56','G57','G58','G59']
    },{
      code:15,
      commands:['G61','G62','G63','G64']
    },{
      code:16,
      commands:['G68','G69']
    },{
      code:17,
      commands:['G15','G16']
    },{
      code:19,
      commands:['G40.1','G41.1','G42.1']
    },{
      code:22,
      commands:['G50.1','G51.1']
    }]
    //Fanuc 10/11/15
    this.groupII = [{
      code:1,
      commands:['G0','G00','G1','G01','G2','G02','G3','G03','G33']
    },{
      code:2,
      commands:['G17','G18','G19']
    },{
      code:3,
      commands:['G90','G91']
    },{
      code:4,
      commands:['G22','G23']
    },{
      code:5,
      commands:['G93','G94','G95']
    },{
      code:6,
      commands:['G20','G21']
    },{
      code:7,
      commands:['G40','G41','G42']
    },{
      code:8,
      commands:['G43','G44','G45']
    },{
      code:9,
      commands:['G73','G74','G76','G80','G81','G82','G83','G84','G85','G86','G87','G88','G89']
    },{
      code:10,
      commands:['G98','G99']
    },{
      code:11,
      commands:['G50','G51']
    },{
      code:12,
      commands:['G65','G66','G67']
    },{
      code:13,
      commands:['G96','G97']
    },{
      code:14,
      commands:['G54','G55','G56','G57','G58','G59']
    },{
      code:15,
      commands:['G61','G62','G63','G64']
    },{
      code:16,
      commands:['G68','G69']
    },{
      code:17,
      commands:['G15','G16']
    },{
      code:18,
      commands:['G50.1','G51.1']
    },{
      code:19,
      commands:['G40.1','G41.1','G42.1']
    }]
  }

  format(code){
    if(this.main) return code < 10 ? `${Tokens.MACRO()}400${ code }` : `${Tokens.MACRO()}40${ code }`
    else return code < 10 ? `${Tokens.MACRO()}410${ code }` : `${Tokens.MACRO()}41${ code }`
  }

  format2(code){
    if(this.main) return code < 10 ? `${Tokens.MACRO()}420${ code }` : `${Tokens.MACRO()}42${ code }`
    else return code < 10 ? `${Tokens.MACRO()}430${ code }` : `${Tokens.MACRO()}43${ code }`
  }

  execFirstGroup(tokens/* array */,callback){
    for(let t of tokens){
      for(let g of this.groupI){
        for(let c of g.commands){
          if(!includesToken(tokens,['G65','G66'])){
            if(this.main && t === c){//for the "G"
              callback(
                this.format(g.code),
                +c.slice(1)
              )
              break
            }else if(t[0] === c){//for others
              callback(
                this.format(g.code),
                +t.slice(1)
              )
              break
            }
          }
        }
      }
    }
  }

  execSecondGroupCallbackCore(callback,g,executing){
    if(typeof g.preceding === 'undefined') g.preceding = null
    callback({
      name:this.format(g.code),//preceding
      value:g.preceding
    },{
      name:this.format2(g.code),//executing
      value:executing
    })
    g.preceding = executing
  }

  execSecondGroup(tokens/* array */,callback){
    for(let t of tokens){
      for(let g of this.groupII){
        for(let c of g.commands){
          if(!includesToken(tokens,['G65','G66'])){
            if(this.main && t === c){//for the "G"
              let executing = +c.slice(1)//<== draw attention, the value is taken from the code
              this.execSecondGroupCallbackCore(callback,g,executing)
              break
            }else if(t[0] === c){//for others
              let executing = +t.slice(1)//<== draw attention, the value is taken from the token
              this.execSecondGroupCallbackCore(callback,g,executing)
              break
            }
          }
        }
      }
    }
  }

  get(inTokens,fanucICallback,fanucIICallback){
    const controller_group = controllerMacroVersionConverter(CONFIG_SYSTEM.get())
     
    switch(controller_group){
      case 1: //Fanuc 0/16/18/20?/21
        this.execFirstGroup(inTokens,(name,value) => {
          fanucICallback(name,value)
        })
      break;
      default://Fanuc 10/11/15
        this.execSecondGroup(inTokens,(o,o2) => {
          fanucIICallback(o,o2)
        })
      break
    }
  }
}

class OtherModal extends Modal{
  constructor(){
    super()
    this.main = false
    this.init()
  }

  init(){
    this.model = [{
      code:2,
      commands:['B']
    },{
      code:7,
      commands:['D']
    },{
      code:8,
      commands:['E']
    },{
      code:9,
      commands:['F']
    },{
      code:11,
      commands:['H']
    },{
      code:13,
      commands:['M']
    },{
      code:15,
      commands:['O']
    },{
      code:19,
      commands:['S']
    },{
      code:20,
      commands:['T']
    }]
    //Fanuc 0/16/18/20?/21
    this.groupI = this.model
    //Fanuc 10/11/15
    this.groupII = this.model
  }
}

class AxisSystem{
  constructor(){
    this.init()
  }

  init(){
    this.x = 0
    this.y = 0
    this.z = 0
    this.a = 0
    this.b = 0
  }
}

class PositioningMode{
  constructor(){
    this.mode = PositioningMode.ABSOLUTE()
  }

  static ABSOLUTE(){
    return 'G90'
  }

  static INCREMENT(){
    return 'G91'
  }

  exec(tokens){
    for(let t of tokens){
      if(t === PositioningMode.ABSOLUTE()){
        this.mode = PositioningMode.ABSOLUTE()
      }else if(t === PositioningMode.INCREMENT()){
        this.mode = PositioningMode.INCREMENT()
      }
    }
  }

  getMode(){
    return this.mode
  }
}

class ToolLocation{
  constructor(){
    this.previousLocation = new AxisSystem()
    this.currentLocation = new AxisSystem()
    this.axis = new AxisSystem()
    this.locationCache = new AxisSystem()
  }

  exec(tokens,callback){
    this.currentLocation = Object.create(this.previousLocation)
    for(let t of tokens){
      for(let key in this.axis){
        if(t.toLowerCase()[0] === key){
          callback(key,+t.slice(1))
          this.locationCache[key] = this.previousLocation[key]
        }
      }
    }
    this.previousLocation = this.currentLocation
  }

  execForAbsolute(tokens){
    this.exec(tokens,(key,value) => {
      this.currentLocation[key] = value
    })
  }

  execForIncrement(tokens){
    this.exec(tokens,(key,value) => {
      this.currentLocation[key] = this.currentLocation[key] + value
    })
  }

  runMill(tokens,positioningMode){
    switch(positioningMode.getMode()){
      case PositioningMode.ABSOLUTE():
        this.execForAbsolute(tokens)
      break;
      case PositioningMode.INCREMENT():
        this.execForIncrement(tokens)
      break;
    }
  }

  execLathe(tokens){
    const latheIncrementKeys = ['U','W']
    const convertTo = ['x','z']
    this.currentLocation = Object.create(this.previousLocation)
    for(let t of tokens){
      for(let key in this.axis){
        if(t.toLowerCase()[0] === key){
          this.currentLocation[key] = +t.slice(1)
          this.locationCache[key] = this.previousLocation[key]
        }
      }
      for(let i = 0;i < latheIncrementKeys.length;i++){
        if(t[0] === latheIncrementKeys[i]){
          const key = convertTo[i]
          this.currentLocation[key] = this.currentLocation[key] + +t.slice(1)
          this.locationCache[key] = this.previousLocation[key]
        }
      }
    }
    this.previousLocation = this.currentLocation
  }

  runLathe(tokens){
    this.execLathe(tokens)
  }

  get(callbackPrevious,callbackCurrent){
    let i = 1
    for(let key in this.axis){
      callbackPrevious({
        name:`${Tokens.MACRO()}500${i}`,
        value:this.locationCache[key]
      })
      callbackCurrent({
        name:`${Tokens.MACRO()}504${i}`,
        value:this.currentLocation[key]
      })
      i++//increment variable system name
    }
  }
}
