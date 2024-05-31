<script setup lang="ts">
    import Aside from '../components/Aside.vue';  
    import MainUserList from '../components/MainUserList.vue';  
</script>

<template>
    <el-container class="sh-container">
        <!-- <el-header class="sh-header">Header</el-header> -->
        <!-- <Header/> -->
        <el-container class="sh-container-main">
            <!-- <el-aside width="200px" class="sh-main">Aside</el-aside>
            <el-main class="sh-main">Main</el-main> -->
            <!-- <Aside/> -->
            <MainUserList/>
        </el-container> 
        <!-- <el-footer class="sh-footer">Footer</el-footer> -->
        <!-- <Footer/> -->
    </el-container>
</template>


<style>
.sh-container {
    height: 703px;
    /* max-height: 91vh; */
    background-color: aquamarine;
    /* overflow: hidden; */
}
.sh-header {
    height: 8%;
    background-color: antiquewhite;
}
.sh-container-main {
    background-color: azure;
    /* height: 90%; */
}
.sh-main {
    height: 100%;
    background-color: aqua;
}
.sh-footer {
    height: 8%;
    background-color: black;
}
</style>
