'use string'

class Backup{
  constructor(cg,limit = Backup.STANDARD_LIMIT()){
    this._limit = limit
    this._cg = cg
    this._config = this._cg.get()
    this._array = this._config.backup.array
    this._cursor = this._config.backup.cursor
  }

  static STANDARD_LIMIT(){
    return 50
  }

  add(str){
    if(!this._array.includes(str)){
      if(this._array.length <= this._limit){
        this._array.push(str)
        this._cursor++
      }else{
        this._array = this._array.slice(1) 
        this._array.push(str)
      }
      this._config.backup = {
        array:this._array,
        cursor:this._cursor
      }
      this._cg.save(false)
    }
  }

  backward(){
    if(this._cursor > 0) this._cursor--
  }

  forward(){
    if(this._cursor < this._array.length - 1) this._cursor++
  }

  getLast(){
    return this._array[this._cursor]
  }

  getAll(){
    return this._array.slice(0)
  }
}