'use strict'

class Path{
  constructor(){
    this._init()
  }

  static SEPARATOR(){
    return '.'
  }

  _init(){
    this._path = ''
  }

  clear(){
    this._init()
  }

  add(name){
    this._path += this._path.length === 0 ? name : Path.SEPARATOR() + name
  }

  _remove(){
    for(let i = this._path.length;i >= 0;i--){
      if(this._path.charAt(i) === Path.SEPARATOR()) return this._path.slice(0,i)
    }
    this.clear()
    return this._path
  }

  removePath(){
    this._path = this._remove()
  }

  getAbsolutePath(){
    return this._path
  }

  static getDirectory(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === Path.SEPARATOR()) return str.slice(0,i)
    }
    return ''
  }

  static getLast(str){
    for(let i = str.length;i >= 0;i--){
      if(str.charAt(i) === Path.SEPARATOR()) return str.slice(0,i)
    }
    return str
  }

  getRelativePath(){
    return Path.getLast(this._path)
  }
}