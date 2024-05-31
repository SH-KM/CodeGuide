// user.ts

import request from '@/utils/request';

interface User {
  id: number | null;
  name: string;
  age: number | null;
  sex: string;
}

// 获取用户列表
export const getUserListService = ():Promise<User[]> => {
  return request.get('/getUserList');
};

// 添加用户
export const addUserService = (user: User):Promise<User> => {
  return request.post('/add', user);
};

// 编辑用户信息
export const editUserService = (user: User):Promise<User> => {
  return request.put(`/edit/${user.id}`, user);
};

// 根据ID删除用户
export const deleteUserService = (id: number) => {
  return request.delete('/deleteById?id=' + id);
};

// 根据姓名和性别查询用户信息
export const queryService = (name: string, sex: string):Promise<User[]> => {
  return request.get('/query', {
    params: { name, sex }
  });
};
