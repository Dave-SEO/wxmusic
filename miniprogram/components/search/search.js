// components/search/search.js
let val = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  options:{
    styleIsolation: "apply-shared"
  },
  /**
   * 组件的方法列表
   */
  methods: {
    searchValue(event){
      val = event.detail.value
      if(event.detail.value.trim() === ''){
        this.search()
      }
    },
    search(){
      this.triggerEvent('onSearch', {
        value: val
      })
    }
  }
})
