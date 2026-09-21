import axios from 'axios';
import router from '../router';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost', // 默认前缀
  timeout: 120000, // 请求超时时间（AI分析等慢接口需要更长等待）
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  withCredentials: true // 允许携带cookie
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 不再从localStorage中获取token，也不添加到请求头
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 可以在这里统一处理响应数据
    return response.data;
  },
  error => {
    // 处理401错误
    if (error.response && error.response.status === 401) {
      // 清除localStorage中的userInfo
      localStorage.removeItem('userInfo');
      // 跳转到登录页面
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default request;