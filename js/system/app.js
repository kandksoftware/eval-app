'use strict'

class App{
  constructor(){
    this._cg = new Config()
    this._config = this._cg.get()
    //this.menuview = new MenuView(this)
    //this.menuview.callOncreate()
    //this.menuview.refresh()

    //this.bottomMenuView = new BottomMenuView(this)
    //this.bottomMenuView.callOncreate()
    //this.bottomMenuView.refresh()
  }
  
  menuController(o){
    switch(o.event.name){
      case 'onclick':
        switch(o.element.dataset.id){
          case 'open-sidebar':
            //new SidebarController().show()
          break
        }
      break
    }
  }
  
  setMenuTitleOncreate(){}
  
  addMenuButtonOncreate(){}
  
  setMenuTitle(string){
    /*this.menuview.setTitle(string)
    this.menuview.refresh()*/
  }
  
  setMenuButton(array){
    /*this.menuview.addButton(array)
    this.menuview.refresh()*/
  }

  setLeftMenuButton(button){
    /*this.menuview.addLeftButton(button)
    this.menuview.refresh()*/
  }

  getTest(){
		return this.inputTest
  }

  setBottomMenuContent(bottomMenuContent){
    /*this.bottomMenuView.setBottomMenuContent(bottomMenuContent)*/
  }

  bottomMenuController(o){}

  onExit(){}

  show(){}

  hide(){}
}
