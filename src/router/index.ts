import {createRouter,createWebHistory} from 'vue-router'

import MainUserList from '@/components/MainUserList.vue'
import MainTreeList from '@/components/MainTreelist.vue'
import TreeTable from '@/components/TreeTable.vue'
import GetRegions from '@/components/GetRegions.vue'

const routes = [
    {  
        path: '/',  
        redirect: '/tree' // 设置默认重定向到 /tree  
    },
    {
        path: '/tree',
        name: 'MainTreeList',
        component: MainTreeList
    },
    {
        path: '/user',
        name: 'MainUserList',
        component: MainUserList
    },
    {
        path: '/treetable',
        name: 'TreeTable',
        component: TreeTable
    },
    {
        path: '/get',
        name: 'GetRegions',
        component: GetRegions
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router