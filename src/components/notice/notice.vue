<template>
  <transition name="slide">
    <div class="m-container">
      <navbar :title="$t('navigator.notice')" @back="back" :showClose="showClose"></navbar>
      <div class="list" v-if="noticeList">
        <div class="item-box">
          <div class="item" @click="toItem('PTGG')">
            <div class="item_left">
              <span class="title">1、{{$t('notice.noticeItem1')}}</span>
            </div>
          </div>
        </div>
        <div class="item-box">
          <div class="item" @click="toItem('CPGG')">
            <div class="item_left">
              <span class="title">2、{{$t('notice.noticeItem2')}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="hasData">
        <div class="no_data">
          <i class="iconfont icon-nodata"></i>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
  import $ from 'jquery'
  import Navbar from 'base/navbar/navbar'
  import * as API from 'common/js/http'
  import 'weui'
  import weui from 'weui.js'

  export default {
    data() {
      return {
        showClose: false,
        loading: null,
        noticeList: [],
        hasData: false
      }
    },
    created() {
      this.$i18n.locale = this.$route.params.lang === 'zh' ? 'zh' : 'en'
      this.loading = weui.loading('加载中')
    },
    mounted() {
      setTimeout(() => {
        this._getNoticeList()
      }, 20)
    },
    methods: {
      back() {
        this.$router.back()
      },
      _getNoticeList() {
        $.ajax({
          type: "POST",
          url: API.api + '/api/v1/notice/caption',
          dataType: "jsonp",
          headers: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: (res) => {
            if (!res.ret) {
              weui.toast(res.msg, {
                duration: 1500
              })
              this.hasData = true
              setTimeout(() => {
                this.loading.hide()
              }, 20)
              return false
            }
            setTimeout(() => {
              this.loading.hide()
            }, 20)
            let list = res.rows
            this.noticeList = list
            this.hasData = false
          },
          error: (err) => {
            console.log(err)
            weui.toast('网络异常', {
              duration: 1500
            })
          }
        })
      },
      toItem(id) {
        this.$router.push({
          path: '/notice-item/' + id + '/' + this.$i18n.locale
        })
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped lang="scss">
  .m-container {
    position: relative;
    width: 100%;
    background: #fff;
  }
  .list{
    position: fixed;
    top: 50px;
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .item-box {
    padding-bottom: 10px;
  }
  .item{
    position:relative;
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing:border-box;
    background:#fff;
    transition:all .3s;
    border-radius:4px;
    box-shadow:0 1px 3px 0 rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 2px 1px -1px rgba(0,0,0,.12)
  }
  .item:active{
    box-shadow: 0 1px 3px 0 rgba(244,67,54,.2), 0 1px 1px 0 rgba(244,67,54,.14), 0 2px 1px -1px rgba(244,67,54,.12);
  }
  .item_left{
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow:hidden;
  }
  .item_left .title {
    font-size: 18px;
    padding-bottom: 5px;
    flex:1;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
    color: #ff5251;
  }
  span {
    font-size: 14px;
  }
</style>
