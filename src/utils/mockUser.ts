import Mock from 'mockjs';  
  
interface User {  
    id: number | null;  
    name: string;  
    age: number | null;  
    sex: string;  
}  
  
// 创建一个用户列表的模拟数据  
const userList: User[] = Mock.mock({  
    'list|10': [{  
        'id|+1': 1,  
        'name': '@cname',  
        'age|1-100': 25,
        'sex|1': ['男', '女']  
    }]  
}).list;  
  
// 模拟获取用户列表  
Mock.mock('/api/getUserList', 'get', () => {  
    return {  
        code: 1, // 通常表示成功  
        msg: 'success',  
        data: userList // 直接返回用户列表，而不是包含list属性的对象  
    };  
});  
  
// 模拟添加用户（假设返回新添加的用户信息）  
Mock.mock('/api/add', 'post', (options) => {
    // 解析请求体中的数据
    const newUser: User = JSON.parse(options.body);
    // 生成一个新的唯一ID
    newUser.id = userList.length > 0 ? Math.max(...userList.map(user => user.id!)) + 1 : 1;
    // 将新用户添加到userList中
    userList.push(newUser);
    // 返回成功消息和添加的用户数据
    return {
        code: 1,
        msg: '添加成功',
        data: newUser
    };
}); 
  
// 模拟编辑用户信息（假设返回编辑后的用户信息）  
Mock.mock(/\/api\/edit\/\d+/, 'put', (options) => {  
    const match = options.url.match(/\/api\/edit\/(\d+)/);
    const id = match ? parseInt(match[1]) : null;
    console.log('id',id);
    
    const updatedUser: User = JSON.parse(options.body);  
    // 查找并更新具有相同ID的用户
    const index = userList.findIndex(user => user.id === id);
    console.log('index',index);
    
    if (index !== -1) {
        // 更新用户信息
        userList[index] = { ...userList[index], ...updatedUser };
        console.log('mock',userList[index])
    }
    return {  
        code: 1,  
        msg: '编辑成功',  
        data: updatedUser  
    };  
});  
  
// 模拟根据ID删除用户  
Mock.mock(RegExp('/deleteById\\?id=\\d+'), 'delete', (options) => {
    // 从URL中获取id参数
    const query = options.url.split('?')[1];
    const params = new URLSearchParams(query);
    const idToDelete = parseInt(params.get('id')!);

    // 根据id删除对应的用户
    // const resultList = userList.filter(user => user.id !== idToDelete);
    // 查找要删除的用户的索引
    const index = userList.findIndex(user => user.id === idToDelete);

    // 如果找到了用户，就从数组中删除
    if (index !== -1) {
        userList.splice(index, 1);
    }

    // 返回操作结果
    return {
        code: 1,
        msg: '删除成功',
        data: null
    };
});  
  
// 模拟根据姓名和性别查询用户信息  
Mock.mock(/\/api\/query/, 'get', (options) => {
    // 解析请求参数
    const params = new URLSearchParams(options.url.split('?')[1]);
    const name = params.get('name');
    const sex = params.get('sex');

    console.log('params:',name,sex);
    
    // 根据请求参数筛选 userList
    const filteredList = userList.filter(user => {
        return (name ? user.name === name : true) && 
               (sex ? user.sex === sex : true);
    });

    // 返回筛选后的数据
    return {
        code: 1,
        msg: '查询成功',
        data: filteredList
    };
});