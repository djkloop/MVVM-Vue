export default interface GoodVueInterFace {
  el: string
  vm?: {
    subQueue?: {
      target?: Object | {}
      subs?:Array<any>
      notifyAllSubs?:Function
      addSub?: Function
    }
  }
}