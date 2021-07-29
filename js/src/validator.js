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
    return c >= '0' && c <= '9' || c === Tokens.MACRO() || c === '.'
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

  spacer(str,format = false){
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
        Tokens.ARGS_SEPERATOR(),
        ,'×','÷','%','√','π','∛','^','‰'
      ].includes(c)) return ' ' + c + ' '
      if(c === '*'){
        if(b !== '*' && n !== '*') return ' ' + c + ' '
        else if(b !== '*') return ' ' + c
        else if(n !== '*') return c + ' '
      } 
      //wtf is letter and not?
      if(Tokens.isLetter(c) && !Tokens.isLetter(c) || (c === Tokens.MACRO() && !format)) return ' ' + c
      else if(Tokens.isLetter(b) && Tokens.isLetter(c)){
        if(Tokens.isNumber(n)){
          return c
        }else{
          if(!Tokens.isLetter(n)) return c + ' '
          else return c
        }
      } 
      else if(Tokens.isNumber(c) && !Tokens.isNumber(n)) return c + ' '
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
    this.init()
  }

  init(){
    this.is = false
    this.array = []
    this.ln = 0
  }

  add(mess){
    this.is = true
    this.array.push({
      ln:this.ln,
      mess:mess
    })
  }

  get(){
    return this.array.slice(0)
  }

  isError(){
    return this.is
  }

  length(){
    return this.array.length()
  }

  clear(){
    this.init()
  }
  
  setLineNumber(ln){
    this.ln = ln + 1
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

  testPerformance(str){
    const a = performance.now()
    this.spacer(str)
    const b = performance.now()
    console.log('It took ' + (b - a) + ' ms.')
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

