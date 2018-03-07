<template>
  <transition name="slide">
    <div class="box">
      <navbar :title="$t('navigator.addApply')" @back="back" :showClose="showClose"></navbar>
      <div class="content">
        <div class="item_head">
          <i class="iconfont icon-item"></i>
          <span class="title">{{currentProduct.name}}</span>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>申购份额：</span>
            <span class="new_data">{{currentProduct.subscribe_money}}万份</span>
          </div>
          <div class="item__right">
            <span>申购时间：</span>
            <span class="all_data">{{currentProduct.subscribe_time}}</span>
          </div>
        </div>
        <div class="item_body">
          <div class="item__left">
            <span>最小份额：</span>
            <span class="new_data">{{currentProduct.min_money / 10000}}万份</span>
          </div>
          <div class="item__right">
            <span>申购状态：</span>
            <span class="all_data">{{currentProduct.subscribe_status}}</span>
          </div>
        </div>
        <div class="item_foot" v-if="currentProduct.recast_start_time">
          <span>复投开始：</span>
          <span>{{currentProduct.recast_start_time}}</span>
        </div>
        <div class="item_foot" v-if="currentProduct.recast_end_time">
          <span>复投结束：</span>
          <span>{{currentProduct.recast_end_time}}</span>
        </div>
        <div class="item_foot" style='display:flex'>
          <span>结算时间：</span>
          <div style="flex:1;display:flex;flex-wrap:wrap;">
            <div style="display:flex;width:50%;" v-for="(t, i) in currentProduct.settlement_time" :key="i">
              <span style='flex:1'>{{t}}</span>
            </div>
          </div>
        </div>
      </div>
      <form class="form_area" method="post" @submit.prevent="formSubmit()">
        <div style="padding: 0 15px;">
          <div class="select_type" v-if="pickerArr.length > 1">
            <i class="iconfont icon-unfold"></i>
            <span class="type_title">方案类型：</span>
            <input type="text" palceholder="请选择方案类型" @click="selectPlan" readonly :value="curValue" />
          </div>
        </div>
        <div class="input_area">
          <div class="input_form">
            <i class="iconfont icon-redeemed"></i>
            <span class='unit'>万份</span>
            <input type="number" v-model="subscribeAmt" maxlength="20" placeholder="请输入追加申购份额" />
          </div>
        </div>
        <div class="btn_area">
          <button type="submit" :disabled="btnDisabled" :class="{'weui-btn_disabled': btnDisabled}" class="weui-btn weui-btn_primary"><i :class="{'weui-loading': btnLoading}"></i>{{subscribeBtnTxt}}</button>
        </div>
      </form>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
  import $ from 'jquery'
  import Navbar from 'base/navbar/navbar'
  import {getUserInfo, getProduct} from 'common/js/storage'
  import {_normalizeStr} from 'common/js/tool'
  import Plan from 'common/js/plan'
  import * as API from 'common/js/http'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        showArr: [],
        pickerArr: [],
        curValue: '',
        currentPlan: null,
        currentProduct: null,
        subscribeAmt: '',
        currentChannel: 'JSYH',
        subscribeBtnTxt: '追加申购',
        btnLoading: false,
        btnDisabled: false
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : 'en'
      this.currentProduct = getProduct()
    },
    mounted() {
      var that = this
      this.$nextTick(() => {
        this.getSubProductList(that, this.currentProduct.base_product_id)
      })
    },
    methods: {
      back() {
        this.$router.back()
      },
      /**
       * 获取申购项目子列表
      */
      getSubProductList(that, id) {
        $.ajax({
          type: "POST",
          url: API.api + '/api/v1/product/listByBaseId',
          data: {
            base_product_id: id
          },
          async: false,
          dataType: "jsonp",
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            var list = res.obj.list.reverse()
            var pickerArr = []
            var showArr = list
            if (showArr.length > 0) {
              showArr.forEach((item, index) => {
                item.settlement_time = _normalizeStr(item.settlement_time)
                pickerArr.push(new Plan({
                  label: item.name,
                  value: index
                }))
              })
              this.pickerArr = pickerArr
              this.showArr = showArr
              this.currentPlan = showArr[0]
              this.curValue = pickerArr[0].label
            }
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', {
              duration: 1500
            })
          }
        })
      },
      // 方案选择
      selectPlan() {
        weui.picker(this.pickerArr, {
          container: 'body',
          defaultValue: [0],
          onChange: (result) => {
              console.log('change' + result)
          },
          onConfirm: (result) => {
            this.currentPlan = this.showArr[result]
            this.curValue = this.pickerArr[result].label
          }
        })
      },
      // 提交赎回
      formSubmit: function () {
        var that = this
        let param = this.subscribeAmt
        let planName = this.currentPlan.name
        if (this.checkSubscribe(that, param)) {
          weui.confirm('您确认要追加' + planName + '申购份额' + param + '万份吗', () => {
            this.subscribeBtnTxt = "追加申购中"
            this.btnDisabled = true
            this.btnLoading = true
            this.mySubmit(that, param)
          }, () => {
            console.log('已取消')
          }, {
            title: '追加提示'
          })
        }
      },
      // 校验追加金额
      checkSubscribe: function (that, param) {
        var amt = param
        if (!amt) {
          weui.alert('请输入追加申购份额', {
            title: '提示'
          })
          return false
        } else if (amt < 1) {
          weui.alert('最小追加份额为1万份', {
            title: '提示'
          })
          return false
        } else if (amt > 100000) {
          weui.alert('最大追加份额为100000万份', {
            title: '提示'
          })
          return false
        } else if (amt % 1 !== 0) {
          weui.alert('追加递增份额为1万份', {
            title: '提示'
          })
          return false
        } else {
          return true
        }
      },
      mySubmit: function (that, param) {
        var subscribeAmt = parseInt(param)
        var product_id = that.currentPlan.id
        var customer_id = getUserInfo().id
        $.ajax({
          type: "POST",
          url: API.api + '/api/v1/subscribe/addRecast',
          data: {
            product_id: product_id,
            customer_id: customer_id,
            money: subscribeAmt * 10000
          },
          dataType: "jsonp",
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (!res.ret) {
              weui.toast(res.msg, {
                duration: 1500
              })
              this.subscribeBtnTxt = "追加申购"
              this.btnDisabled = false
              this.btnLoading = false
              return false
            }
            weui.toast(res.msg, {
              duration: 1500
            })
            setTimeout(() => {
              this.subscribeBtnTxt = "追加申购"
              this.btnDisabled = false
              this.btnLoading = false
              this.$router.push({
                path: '/' + this.$i18n.locale
              })
            }, 500)
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', {
              duration: 1500
            })
            this.subscribeBtnTxt = "追加申购"
            this.btnDisabled = false
            this.btnLoading = false
          }
        })
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped lang="scss">
.content {
  width:100%;
  display:flex;
  flex-direction:column;
  padding:65px 15px 5px;
  box-sizing:border-box;
}
.item_head{
  position: relative;
  line-height:30px;
  padding-bottom:10px;
}
.item_head i{
  color: #ff5251;
  font-size: 18px;
}
.item_head .title{
  padding-left: 10px;
  font-size: 18px;
  color: #212121;
}
.item_body{
  display: flex;
  line-height: 1.5;
}
.item__left,.item__right{
  flex: 1;
  color: #333333;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.new_data,.all_data{
  font-size: 16px;
  color: #ff5251;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.item_foot{
  color: #333333;
  line-height: 1.5;
  font-size: 14px;
  display: flex;
}
.form_area{
  display:flex;
  flex-direction:column;
  width:100%;
  padding: 15px 0;
}
.select_type {
  flex: 1;
  display:flex;
  align-items:center;
  height:40px;
  box-sizing:border-box;
}
.select_type {
  color: #333333;
  position: relative;
  margin-bottom: 5px;
}
.select_type i {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 40px;
  z-index: 0;
}
.select_type input {
  flex: 1;
  height: 40px;
  font-size: 18px;
  border-radius: 0;
  border-bottom: 1px solid #ff5251;
  box-sizing: border-box;
}
.type_title {
  flex: 0 1 auto;
  font-size: 14px;
}
.input_area{
  flex:1;
  padding:0 15px;
}
.input_form{
  position:relative;
  box-sizing:border-box;
  line-height: 1.5;
  display: flex;
  align-items: center;
}
.input_form i{
  font-size:18px;
  position:absolute;
  left:0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff5251;
}
.input_form .unit{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  color: #ff5251;
}
.input_form input{
  height:50px;
  line-height:16px;
  padding:17px 25px;
  font-size: 16px;
  flex:1;
  border-radius: 0;
  border-bottom:1px solid #BDBDBD;
  box-sizing: border-box;
  background: #fff;
  outline: none;
}
.btn_area{
  margin-top: 30px;
  padding:0 15px;
}
</style>
