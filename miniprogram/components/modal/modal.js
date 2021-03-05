// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modal: Boolean,
    bottom: String
  },
options:{
  styleIsolation: 'apply-shared',
  multipleSlots: true
},
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    close(){
      this.triggerEvent('closeModal')
    }
  }
})
