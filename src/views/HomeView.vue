<script setup lang="ts">
import Aside from '@/components/Aside.vue';
// import MainUserList from '../components/MainUserList.vue';  
// import MainTreelist from '@/components/MainTreelist.vue';
// import TreeList from '@/components/TreeList.vue';
</script>

<template>
    <el-container class="home-container">
        <el-row :span="24" style="background-color: aqua; width: 100%;">
            <el-col :xs="2" :sm="2" :md="2" :lg="4" :xl="4" style="background-color: antiquewhite;">
                <Aside />
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="20" :xl="20" style="background-color: blueviolet;">
                <RouterView />
            </el-col>
        </el-row>
    </el-container>
</template>


<style>
.home-container {
    /* height: 703px; */
    height: 100vh;
    width: 100vw;
    /* max-height: 91vh; */
    background-color: aquamarine;
    /* overflow: hidden; */
}
</style>
