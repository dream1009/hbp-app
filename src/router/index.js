import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Router Modules */

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;

/* Layout */
import Layout from '@/views/layout/layout'
import LayoutInfo from '@/views/layout/layout-info'
import Main from '@/views/layout/app-main'

/**
 *
*
* //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面(默认 false)
* hidden: true

//当设置 true 的时候永远会显示根菜单，不设置的情况下只有当子路由个数大于一个时才会显示根菜单
//当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式。只有一个时会将那个子路由当做根路由
* alwaysShow: true

* name:'router-name'            //设定路由的名字，一定要填写不然 使用 <keep-alive> 时会出现各种问题
* meta : {
  title: 'title'              //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'icon-name'            //设置该路由的图标
  noCache: true               //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
}
 */
// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面 公共页面放在 pages
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: {
      title: '登录'
    },
    component: () => import('@/views/login/index')
  },
  {
    path: '/authredirect',
    name: 'authredirect',
    hidden: true,
    component: () => import('@/views/login/authredirect')
  },
  {
    path: '/404',
    name: 'error-404',
    meta: {
      title: '404-页面不存在'
    },
    hidden: true,
    component: () => import('@/views/error/404')
  },
  {
    path: '/401',
    meta: {
      title: '401- 未授权'
    },
    hidden: true,
    component: () => import('@/views/error/401')
  },
  {
    path: '/403',
    meta: {
      title: '403-权限不足'
    },
    hidden: true,
    component: () => import('@/views/error/403')
  },
  {
    path: '/rate',
    name: 'rate',
    meta: { title: '评价' },
    component: () => import('@/views/bpmn/rate/index')
  },
  {
    path: '/msg2task',
    name: 'msg2task',
    meta: { title: '消息跳转待办' },
    component: () => import('@/views/bpmn/form/msg2task')
  }
]

const asyncRouterMap = [
  /* {
    path: '',
    component: Main,
    redirect: 'home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: '主页', icon: 'home' },
        component: () => import('@/views/layout/home')
      }]
  },*/
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: { title: '首页', icon: 'dashboard' },
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'message',
        meta: { title: '消息', icon: 'message' },
        component: () => import('@/views/message/index')
      }, {
        path: 'chat',
        name: 'chat',
        meta: { title: '聊天', icon: 'message' },
        component: () => import('@/views/message/index')
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'notice',
        meta: { title: '公告', icon: 'notice' },
        component: () => import('@/views/notice/index')
      }, {
        path: 'detail',
        name: 'noticeDetail',
        meta: { title: '公告详情', icon: 'notice', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/notice/detail')
      }, {
        path: 'add',
        name: 'noticeAdd',
        meta: { title: '新建公告', icon: 'notice', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/notice/edit')
      }, {
        path: 'edit',
        name: 'noticeEdit',
        meta: { title: '编辑公告', icon: 'notice', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/notice/edit')
      }

    ]
  },
  {
    path: '/contacts',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'contacts',
        meta: { title: '通讯录', icon: 'contacts' },
        component: () => import('@/views/contacts/index')
      }
    ]
  },
  {
    path: '/my',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'my',
        meta: { title: '我的', icon: 'my' },
        component: () => import('@/views/my/index')
      },
      {
        path: 'userInfo',
        name: 'userInfo',
        meta: { title: '个人信息', icon: 'my', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/my/user-info')
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        meta: { title: '修改密码', icon: 'my', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/my/change-password')
      },
      {
        path: 'setting',
        name: 'setting',
        meta: { title: '设置', icon: 'my', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/my/setting')
      },
      {
        path: 'help',
        name: 'help',
        meta: { title: '帮助', icon: 'help', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/my/help')
      },
      {
        path: 'aboutUs',
        name: 'aboutUs',
        meta: { title: '关于我们', icon: 'my', isLeftBar: true, isShowBar: false },
        component: () => import('@/views/my/about-us')

      }
    ]
  },
  {
    path: '/bpmn',
    redirect: 'pending',
    component: LayoutInfo,
    children: [
      {
        path: 'pending',
        name: 'pending',
        meta: { title: '待办事宜' },
        component: () => import('@/views/bpmn/pending/index')
      }, {
        path: 'completed',
        name: 'completed',
        meta: { title: '办结事宜' },
        component: () => import('@/views/bpmn/completed/index')
      }, {
        path: 'handled',
        name: 'handled',
        meta: { title: '已办事宜' },
        component: () => import('@/views/bpmn/handled/index')
      }, {
        path: 'myRequest',
        name: 'myRequest',
        meta: { title: '我的请求' },
        component: () => import('@/views/bpmn/my-request/index')
      }, {
        path: 'newProcess',
        name: 'newProcess',
        meta: { title: '新建流程', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/new-process/index')
      }, {
        path: 'myDraft',
        name: 'myDraft',
        meta: { title: '我的草稿' },
        component: () => import('@/views/bpmn/my-draft/index')
      }, {
        path: 'myRevoke',
        name: 'myRevoke',
        meta: { title: '可撤销事务' },
        component: () => import('@/views/bpmn/my-revoke/index')
      }, {
        path: 'taskChange',
        name: 'taskChange',
        meta: { title: '我的转办代理' },
        component: () => import('@/views/bpmn/task-change/index')
      }, {
        path: 'taskChangeDetail',
        name: 'taskChangeDetail',
        meta: { title: '详细信息' },
        component: () => import('@/views/bpmn/task-change/detail')
      }, {
        path: 'form',
        name: 'bpmnForm',
        meta: { title: '详细信息', keepAlive: false, canKeep: true },
        component: () => import('@/views/bpmn/form/index')
      }, {
        path: 'formInstance',
        name: 'bpmnFormInstance',
        meta: { title: '详细信息', keepAlive: false },
        component: () => import('@/views/bpmn/form/form')
      }

    ]
  },
  {
    path: '/d/list/:id(\\w+)',
    component: () => import('@/views/data/template-list'),
    name: 'dataTemplateList',
    meta: { title: '模版' }
  },
  {
    path: '/d/form',
    component: () => import('@/views/data/template-form'),
    name: 'dataTemplateform',
    meta: { title: '表单明细' }
  },
  {
    path: '/demo',
    component: LayoutInfo,
    redirect: 'form',
    children: [
      {
        path: 'form',
        name: 'demoForm',
        meta: { title: '表单Demo', icon: 'table' },
        component: () => import('@/views/demo/form')
      },
      {
        path: 'toolbar',
        name: 'demoToolbar',
        meta: { title: '工具栏', icon: 'toolbar' },
        component: () => import('@/views/demo/toolbar')
      },
      {
        path: 'drop-menu',
        name: 'demoDropMenu',
        meta: { title: '下拉菜单', icon: 'drop-menu' },
        component: () => import('@/views/demo/drop-menu')
      }
    ]
  },

  {
    path: '/bpmn-cust',
    redirect: 'pending-cust',
    component: LayoutInfo,
    children: [
      {
        path: 'pending-cust',
        name: 'pending-cust',
        meta: { title: '待办事宜', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/pending/custom')
      }, {
        path: 'completed-cust',
        name: 'completed-cust',
        meta: { title: '办结事宜', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/completed/custom')
      }, {
        path: 'handled-cust',
        name: 'handled-cust',
        meta: { title: '已办事宜', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/handled/custom')
      }, {
        path: 'myRequest-cust',
        name: 'myRequest-cust',
        meta: { title: '我的请求', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/my-request/custom')
      }, {
        path: 'myDraft-cust',
        name: 'myDraft-cust',
        meta: { title: '我的草稿', keepAlive: true, canKeep: true },
        component: () => import('@/views/bpmn/my-draft/custom')
      }, {
        path: 'myRevoke-cust',
        name: 'myRevoke-cust',
        meta: { title: '可撤销事务' },
        component: () => import('@/views/bpmn/my-revoke/custom')
      }, {
        path: 'qrCode',
        name: 'qrCode',
        meta: { title: '二维码' },
        component: () => import('@/components/Qrcode/index')
      }/*, {
        path: 'form',
        name: 'bpmnForm',
        meta: { title: '详细信息' },
        component: () => import('@/views/bpmn/form/custom')
      }*/

    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap.concat(asyncRouterMap)
})
