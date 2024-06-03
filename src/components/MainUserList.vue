<script setup lang="ts">
import { ref } from "vue";
import "@/utils/mockUser"
import {getUserListService, addUserService, editUserService, deleteUserService, queryService} from '@/api/user'

const inputName = ref('')
const inputSex = ref('')
const tableData = ref<User[]>([])
//控制抽屉是否显示
const visibleDrawer = ref(false)
const dialogVisible = ref(false)

interface User {
    id: number | null;
    name: string;
    age: number | null;
    sex: string;
}
const userModel = ref<User>({
    name: '',
    age: null,
    sex: '',
    id: null
})

// 定义清空数据模型的方法
const clearUserModel = () => {
    userModel.value = {
        id: null,
        name: '',
        age: null,
        sex: ''
    };
}

// 加载数据
const userList = async () =>{
    let result = await getUserListService();
    // console.log('result',result);
    tableData.value = result;
}
userList()

// 根据姓名和性别查询用户信息
const queryUser = async () =>{
    let result = await queryService(inputName.value, inputSex.value)
    tableData.value = result
}  
// 添加用户
const addUser = async() => {
    const newUser = { ...userModel.value }
    const result = await addUserService(newUser)
    userList()
    clearUserModel()
}

// 编辑用户信息
const editInfo = async() => { 
    const result = await editUserService(userModel.value)
    userList()
    dialogVisible.value = false;
}

// 根据ID删除用户
const userDelete = async (id: number) => {
    await deleteUserService(id)
    // TODO 提示删除的人

    userList()
}

// 定义变量，控制标题的展示
const title = ref('')
// 展示编辑弹框
const showDialog = (row:User) =>{
    dialogVisible.value = true;
    // userModel.value.id = row.id;
    // userModel.value.age = row.age;
    // userModel.value.name = row.name;
    // userModel.value.sex = row.sex;
    userModel.value = { ...row }
}

const showAddDrawer = () =>{
    // 添加之前清空表单数据
    clearUserModel() 
    visibleDrawer.value = true
}

</script>

<template>
    <el-main class="sh-main tmain">
        <div class="header">
            <span>用户管理</span>
            <div class="extra">
                <el-button type="primary" @click="showAddDrawer()">添加用户</el-button>
            </div>
        </div>
        <el-divider />
        <!-- 搜索表单 -->
        <el-form :inline="true">
            <el-form-item label="姓名">
                <el-input v-model="inputName" style="width: 200px" placeholder="Please input" />
            </el-form-item>
            <el-form-item label="性别">
                <el-select style="width: 200px" placeholder="请选择" v-model="inputSex">
                    <el-option label="男" value="男"></el-option>
                    <el-option label="女" value="女"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryUser()">搜索</el-button>
                <el-button @click="userList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 用户列表 -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="ID" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="age" label="年龄" width="120" />
            <el-table-column prop="sex" label="性别" width="600" />
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="{ row }">
                    <el-button link type="danger" size="small" @click="userDelete(row.id)">
                        删除
                    </el-button>
                    <el-button link type="primary" size="small" @click="showDialog(row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" title="添加用户" direction="rtl" size="40%">
            <!-- 添加用户表单 -->
            <el-form :model="userModel" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="userModel.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="userModel.sex" style="width: 200px" placeholder="请选择">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addUser()">添加</el-button>
                    <el-button type="info" @click="visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>

        <el-dialog v-model="dialogVisible" title="编辑" width="500">
            <el-form :model="userModel" label-width="100px">
                <el-form-item label="姓名">
                    <el-input v-model="userModel.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="userModel.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="userModel.sex" style="width: 200px" placeholder="请选择">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="editInfo()">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </el-main>
</template>

<style scoped>
.tmain {
    background-color: #f5f5f5;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
