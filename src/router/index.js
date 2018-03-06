import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from 'common/js/storage'

// 懒加载路由模块导入
const Login = () => import('components/login/login')
const Mine = () => import('components/mine/mine')
const Notice = () => import('components/notice/notice')
const NoticeItem = () => import('components/notice-item/notice-item')
const NoticeDetail = () => import('components/notice-detail/notice-detail')
const Purchase = () => import('components/purchase/purchase')
const ProductDetail = () => import('components/product-detail/product-detail')
const PurchaseRecord = () => import('components/purchase-record/purchase-record')
const AddApply = () => import('components/add-apply/add-apply')
const EditApply = () => import('components/edit-apply/edit-apply')
const ModifyAdditional = () => import('components/modify-additional/modify-additional')
const RedeemRecord = () => import('components/redeem-record/redeem-record')
const Redeem = () => import('components/redeem/redeem')
const ProductPlan = () => import('components/product-plan/product-plan')
const ModifyPlan = () => import('components/modify-plan/modify-plan')
const Question = () => import('components/question/question')
const QuestionDetail = () => import('components/question-detail/question-detail')
const Setting = () => import('components/setting/setting')
const ModifyPwd = () => import('components/modify-pwd/modify-pwd')
const Management = () => import('components/management/management')
// const Canvas = () => import('components/canvas/canvas')
const Weixin = () => import('components/weixin/weixin')
const NoFound = () => import('components/no-found/no-found')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'mine',
      meta: {
        requireAuth: true
      },
      component: Mine
    },
    {
      path: '/notice',
      name: 'notice',
      meta: {
        requireAuth: true
      },
      component: Notice
    },
    {
      path: '/notice-item/:id',
      name: 'noticeItem',
      meta: {
        requireAuth: true
      },
      component: NoticeItem
    },
    {
      path: '/notice-detail',
      name: 'noticeDetail',
      meta: {
        requireAuth: true
      },
      component: NoticeDetail
    },
    {
      path: '/purchase',
      name: 'purchase',
      meta: {
        requireAuth: true
      },
      component: Purchase
    },
    {
      path: '/product-detail',
      name: 'productDetail',
      meta: {
        requireAuth: true
      },
      component: ProductDetail
    },
    {
      path: '/purchase-record',
      name: 'purchaseRecord',
      meta: {
        requireAuth: true
      },
      component: PurchaseRecord
    },
    {
      path: '/add-apply',
      name: 'addApply',
      meta: {
        requireAuth: true
      },
      component: AddApply
    },
    {
      path: '/edit-apply',
      name: 'editApply',
      meta: {
        requireAuth: true
      },
      component: EditApply
    },
    {
      path: '/modify-additional',
      name: 'modifyAdditional',
      meta: {
        requireAuth: true
      },
      component: ModifyAdditional
    },
    {
      path: '/redeem-record',
      name: 'redeemRecord',
      meta: {
        requireAuth: true
      },
      component: RedeemRecord
    },
    {
      path: '/redeem',
      name: 'redeem',
      meta: {
        requireAuth: true
      },
      component: Redeem
    },
    {
      path: '/product-plan',
      name: 'productPlan',
      meta: {
        requireAuth: true
      },
      component: ProductPlan
    },
    {
      path: '/modify-plan',
      name: 'modifyPlan',
      meta: {
        requireAuth: true
      },
      component: ModifyPlan
    },
    {
      path: '/question',
      name: 'question',
      meta: {
        requireAuth: true
      },
      component: Question
    },
    {
      path: '/question-detail',
      name: 'questionDetail',
      meta: {
        requireAuth: true
      },
      component: QuestionDetail
    },
    {
      path: '/setting',
      name: 'setting',
      meta: {
        requireAuth: true
      },
      component: Setting
    },
    {
      path: '/modify-pwd',
      name: 'modifyPwd',
      meta: {
        requireAuth: true
      },
      component: ModifyPwd
    },
    {
      path: '/management',
      name: 'management',
      meta: {
        requireAuth: true
      },
      component: Management
    },
    // {
    //   path: '/canvas',
    //   name: 'canvas',
    //   meta: {
    //     requireAuth: true
    //   },
    //   component: Canvas
    // },
    {
      path: '/weixin',
      name: 'weixin',
      meta: {
        requireAuth: true
      },
      component: Weixin
    },
    {
      path: '*',
      name: 'noFound',
      component: NoFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (getUserInfo().id) {
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
})

export default router
