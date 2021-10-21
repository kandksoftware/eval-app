'use strict'

class Tokens{
  static EOB(){
    return ';'
  }

  static NL(){
    return '\n'
  }

  static BRACKET(){
    return {
      OPEN:'(',
      CLOSE:')',
    }
  }

  static COMMENT(){
    return {
      OPEN:'(',
      CLOSE:')',
    }
  }

  static MACRO(){
    return '#'
  }

  static ARGS_SEPERATOR(){
    return ','
  }

  static isLetter(c){
    return c >= 'A' && c <= 'Z'
  }

  static isNumber(c){
    return c >= '0' && c <= '9' || c === Tokens.MACRO() /*|| c === '.'*/
  }
}

class XString{
  isWSpace(s,i){
    return s.charAt(i) === ' '
  }

  isEOB(s,i){
    return s.charAt(i) === Tokens.EOB()
  }

  isNLine(s,i){
    return s.charAt(i) === '\n'
  }

  onString(s,callback){
    let ns = ''
    for(let i = 0,l = s.length;i < l;i++){
      ns += callback(s,i)
    }
    return ns
  }

  static map(s,callback){
    let ns = ''
    for(let i = 0,l = s.length;i < l;i++){
      ns += callback(s[i],s,i)
    }
    return ns
  }

  spacer(str){
    return this.onString(str,(s,i) => {
      const b = s.charAt(i - 1)
      const c = s.charAt(i)
      const n = s.charAt(i + 1)
      
      if([
        Tokens.BRACKET().OPEN,
        Tokens.BRACKET().CLOSE,
        '+',
        '/',
        '=',
        '-',
        Tokens.ARGS_SEPERATOR(),
        ,'×','÷','%','√','π','∛','^','‰'
      ].includes(c)) return ' ' + c + ' '
      if(c === '*'){
        if(b !== '*' && n !== '*') return ' ' + c + ' '
        else if(b !== '*') return ' ' + c
        else if(n !== '*') return c + ' '
      } 
      
      if(Tokens.isLetter(c) && !Tokens.isLetter(c)) return ' ' + c
      else if(Tokens.isLetter(b) && Tokens.isLetter(c)){
        if(Tokens.isNumber(n)){
          return c
        }else{
          if(!Tokens.isLetter(n)){
            return c + ' '
          } 
          else return c
        }
      } 
      else if(Tokens.isNumber(c) && !(Tokens.isNumber(n) || n === '.' )) return c + ' '
      else return c
    })
  }

  removeWhiteSpace(str){
    return this.onString(str,(s,i) => {
      return !(this.isWSpace(s,i) && this.isWSpace(s,i - 1)) ? s.charAt(i) : ''
    })
  }
}

class StringToArray{
  constructor(){
    this.lines = []
  }
  
  next(s){
    let targets = [/*Tokens.EOB(),*/Tokens.NL()]
    let read = true
    for(let i = 0,l = s.length;i < l;i++){
      for(let j = 0,l2 = targets.length;j < l2;j++){
        if(s.charAt(i) === Tokens.COMMENT().OPEN) read = false
        if(s.charAt(i) === Tokens.COMMENT().CLOSE) read = true
        if(s.charAt(i) === targets[j] && read) return i
      }
    }
    return null
  }
  
  find(s){
    let f = this.next(s)
    if(f !== null){
      this.lines.push(s.slice(0,f))
      this.find(s.slice(f + 1,s.length))
    }
  }

  exec(s){
    this.find(s + Tokens.NL())//adding an extra line to execute the last line of code if EOB is not used
    return this.lines
  }
}

class Error{
  constructor(){
    this._init()
  }

  _init(){
    this._array = []
    this._ln = 0
  }

  add(mess){
    this._array.push({
      ln:this._ln,
      mess:mess
    })
  }

  get(){
    return this._array.slice(0)
  }

  length(){
    return this._array.length
  }

  clear(){
    this._init()
  }
  
  setLineNumber(ln){
    this._ln = ln + 1
  }
}

class Validator extends XString{
  constructor(string = ''){
    super()
    this.string = string
    this.config = CONFIG_SYSTEM.get()
    this.lines = []
    this.LOOP_LIMIT = 100
    this.init()
  }

  init(){
    this.error = new Error()
    this.stringToArray = new StringToArray()
    this.codeLinesWithComments = []
    this.avs = new AVS()
    this.sendObject = null
    this.jumpTest = new JumpTest()
  }

  clear(){
    this.init()
  }
  
  removeComments(s){
    let ns = ''
    let read = true
    for(let i = 0,l = s.length;i < l;i++){
      if(s.charAt(i) === Tokens.COMMENT().OPEN) read = false
      if(read) ns += s.charAt(i)
      if(s.charAt(i) === Tokens.COMMENT().CLOSE) read = true
    }
    return ns
  }

  removeWSandEOB(str){
    return this.onString(str,(s,i) => {
      if(this.isEOB(s,i)) return ''//remove EOB
      if(this.isWSpace(s,i) && this.isWSpace(s,i - 1)) return ''//remove white space
      return str.charAt(i)
    })
  }

  isComment(s){
    return s.indexOf(Tokens.COMMENT().OPEN) === 0 && s.indexOf(Tokens.COMMENT().CLOSE) === s.length - 1
  }

  setString(string){
    this.string = string
  }

  getLines(/*callback*/){
    this.clear()//all of shit before to start
    
    this.string = this.removeWSandEOB(this.string)//Step 1
    this.lines = this.stringToArray.exec(this.string)//Step 2
    
    return this.lines
  }

  end(){
    this.jumpTest.execTest().forEach(j => {
      this.error.setLineNumber(j.inLine)
      this.error.add(j.becauseNoFound + ' ' + LANG.getTokenByName('ON_THE_FLY_ALERT_9'))
    })

    this.sendObject = {
      error:this.error,
      code:this.lines,
      code2:this.codeLinesWithComments,
      tokenLocation:this.jumpTest.get()
    }
    //notify when done
    this.notify('update',this.sendObject)
  }

  receiveObject(){
    return this.sendObject
  }

  loop(lines,startLine){
    let i = startLine
    let stopIn = startLine + this.LOOP_LIMIT
    if(stopIn > lines.length) stopIn = lines.length
    
    for(;i < stopIn;i++){
      this.error.setLineNumber(i)
      RunOneLineTests.exec(lines[i],mess => {this.error.add(mess)})
      lines[i] = lines[i].toUpperCase()
      this.codeLinesWithComments.push(lines[i])//for use with #3001
      lines[i] = this.removeComments(lines[i])
      RunOneLineTests2.exec(lines[i],mess => {this.error.add(mess)})// Run the test for the square brackets
      RunOneLineAdressTest.exec(lines[i],mess => {this.error.add(mess)})//place after remove comments
      lines[i] = this.spacer(lines[i])
      lines[i] = this.removeWhiteSpace(lines[i])
      lines[i] = lines[i].trim()
      RunOneLineKeyTest.exec(lines[i],mess => {this.error.add(mess)})
      this.jumpTest.scan(lines[i].split(' '),i,mess => {this.error.add(mess)})
    }
    return stopIn
  }
}

const removeOneLineComments = str => {
  let read = true
  return XString.map(str,(ch,s,i) => {
    if(s[i] === '/' && s[i + 1] === '/') read = false
    if(s[i] === '\n') read = true
    return read ? s[i] : ''
  })
}

class RecursiveTokenizer{
  constructor(){
    this._array = []
  }
  _spacer(str){
    return new XString().removeWhiteSpace(new XString().spacer(str)).split(' ').filter(t => t !== '')
  }
  
  exec(str){
    const TARGET = '\''
    const loc = str.indexOf(TARGET)
    if(loc === -1){
      this._array = this._array.concat(this._spacer(str))
      return
    } 
    const loc2 = str.slice(loc + 1).indexOf(TARGET)
    if(loc2 === -1){
      this._array = this._array.concat(this._spacer(str))
      return
    }
    const l = str.slice(0,loc)
    const r = str.slice(loc + loc2 + 2)
    const c = str.slice(loc,loc + loc2 + 2)
    this._array = this._array.concat(this._spacer(l))
    this._array = this._array.concat(c)
    this.exec(r)
    return
  }

  get(){
    return this._array.slice(0)
  }
}

class PairNestedTest{
  constructor(targets = []){
    this._targets = targets
  }
  _findDeppest(str,target){
    let lloc = -1
    for(let i = 0,l = str.length;i < l;i++){
      if(str[i] === target) lloc = i
    }
    return lloc
  }
  
  _findFrom(str,target,from){
    for(let i = from,l = str.length;i < l;i++){
      if(str[i] === target) return i
    }
    return -1
  }
  //if returns string with any brackets it means they are not nested correctly
  _areProperelyNested(str){
    const OPEN = '('
    const CLOSE = ')'
    const lo = this._findDeppest(str,this._targets[0])
    if(lo === -1) return str
    else{
      const ff = this._findFrom(str,this._targets[1],lo + 1)
      if(ff === -1) return str
      const s = str.slice(0,lo)
      const e = str.slice(ff + 1)
      str = s + e
      return this._areProperelyNested(s + e)
    }
  }

  _isContainesTargets(str){
    for(let i = 0,l = str.length;i < l;i++){
      if(str[i] === this._targets[0] || str[i] === this._targets[1]) return false
    }
    return true
  }

  exec(str){
    return this._isContainesTargets(this._areProperelyNested(str))
  }
}

class QuotesTest{
  constructor(char){
    this._char = char
  }

  exec(str){
    let found = true
    for(let i = 0,l = str.length;i < l;i++){
      if(str[i] === this._char) found =! found
    }
    return found
  }
}

const removeMultipleComments = str => {
  const f = str.indexOf('/*')
  if(f === -1) return str
  const f2 = str.indexOf('*/')
  if(f2 === -1) return str
  return str.slice(0,f) + removeMultipleComments(str.slice(f2 + 2))//removeMultipleComments()
}






