import axios from 'axios';
import { ElMessage } from 'element-plus';

// 定义基础 URL
const baseURL = '/api';
const instance = axios.create({ baseURL });
const token = '62ba9dcda85b41d6a2fc298af0234a00';
// 添加请求拦截器
instance.interceptors.request.use(  
    config => {  
      // 在发送请求之前做些什么  
      // console.log('config',config);
      // 将 token 其添加到请求头中
      config.headers['token'] = token;   
      
      return config;  
    },  
    error => {  
      // 对请求错误做些什么  
      return Promise.reject(error);  
    }  
);

// 添加响应拦截器
instance.interceptors.response.use(  
    response => {  
    //   console.log('respose',response);
      const { code, msg, data } = response.data; // 使用解构赋值来简化代码  
      console.info('code',code,'mes',msg,'data',data);
      
      // 判断业务状态码  
      if (code === 1 || code === 200) {  
        // 操作成功，返回实际的数据  
        return data; // 注意这里返回的是data，而不是整个response.data  
      }  
    
      // 操作失败，显示错误信息  
      ElMessage.error(msg || '服务异常'); // 如果msg不存在，则显示默认信息  
    
      // 返回一个被拒绝的Promise，并带上服务器返回的错误信息对象（包含code, msg等）  
      return Promise.reject(response.data); // 也可以只返回code或自定义错误对象  
    },  
    error => {  
      // 这里处理请求错误，比如网络错误、超时等  
      // 可以根据需要自定义错误处理逻辑  
      // 例如，可以显示一个通用的错误信息，或者将错误记录到服务器日志等  
      console.error('请求发生错误：', error);  
      ElMessage.error('请求发生错误，请稍后再试');  
        
      // 也可以根据需要返回一个被拒绝的Promise  
      return Promise.reject(error);  
    }  
  );

export default instance;

