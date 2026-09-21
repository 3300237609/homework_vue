import request from './request';

// 用户相关API
export const userApi = {
  // 登录
  login: (data) => {
    return request.post('/user/login', data);
  },
  // 注册
  register: (data) => {
    return request.post('/user/register', data);
  },
  // 删除用户
  deleteUser: (id) => {
    return request.delete(`/user/delete/${id}`);
  },
  // 获取用户列表
  getUserList: (params) => {
    return request.get('/user/list', { params });
  },
  // 添加用户
  addUser: (data) => {
    return request.post('/user/add', data);
  },
  // 更新用户信息
  updateUser: (data) => {
    return request.put('/user/update', data);
  },
  // 根据ID获取用户姓名
  getNameById: (id) => {
    return request.get('/user/getNameById', { params: { id } });
  }
};

// 班级相关API
export const clazzApi = {
  // 添加班级
  addClazz: (data) => {
    return request.post('/clazz/add', data);
  },
  // 更新班级信息
  updateClazz: (data) => {
    return request.put('/clazz/update', data);
  },
  // 获取班级列表
  getClazzList: (params) => {
    return request.get('/clazz/list', { params });
  },
  // 删除班级
  deleteClazz: (id) => {
    return request.delete(`/clazz/delete/${id}`);
  }
};

// 课程相关API
export const courseApi = {
  // 添加课程
  addCourse: (data) => {
    return request.post('/course/add', data);
  },
  // 获取课程列表
  getCourseList: (params) => {
    return request.get('/course/list', { params });
  },
  // 更新课程
  updateCourse: (data) => {
    return request.put('/course/update', data);
  },
  // 删除课程
  deleteCourse: (id) => {
    return request.delete(`/course/delete/${id}`);
  },
  // 获取所有课程名称
  getAllCourseNames: () => {
    return request.get('/course/listAllName');
  },
  // 课程管理 - 获取所有课程
  getAllCourseList: () => {
    return request.get('/course/listAllName');
  },
  // 课程管理 - 添加课程
  addNewCourse: (data) => {
    return request.post('/course/addCourse', data);
  },
  // 课程管理 - 删除课程
  removeCourse: (id) => {
    return request.delete(`/course/deleteCourse/${id}`);
  }
};

// 题目相关API
export const questionApi = {
  // 添加题目
  addQuestion: (data) => {
    return request.post('/question/add', data);
  },
  // 批量添加题目
  batchAddQuestion: (data) => {
    return request.post('/question/batchAdd', data);
  },
  // 分页查询题目
  getQuestionList: (params) => {
    return request.get('/question/list', { params });
  },
  // 获取题目详情
  getQuestionDetail: (params) => {
    return request.get('/question/detail', { params });
  },
  // 删除题目
  deleteQuestion: (questionId) => {
    return request.get('/question/delete', { params: { questionId } });
  }
};

// 作业相关API
export const homeworkApi = {
  // 添加作业
  addHomework: (data) => {
    return request.post('/homework/add', data);
  },
  // 获取作业列表
  getHomeworkList: (params) => {
    return request.get('/homework/list', { params });
  },
  // 获取作业详情
  getHomeworkDetail: (id) => {
    return request.get(`/homework/detail/${id}`);
  },
  // 学生端获取作业详情
  getStudentHomeworkDetail: (id) => {
    return request.get(`/homework/student/detail/${id}`);
  },
  // 更新作业信息
  updateHomework: (data) => {
    return request.put('/homework/update', data);
  },
  // 删除作业
  deleteHomework: (id) => {
    return request.delete(`/homework/delete/${id}`);
  },
  // 学生端查询作业
  getStudentHomeworkList: (params) => {
    return request.get('/homework/student/list', { params });
  },
  // 学生端查询作业详情
  getStudentHomeworkDetail: (id) => {
    return request.get(`/homework/student/detail/${id}`);
  },
  // 保存答案
  saveAnswer: (data) => {
    return request.post('/homework/submit/question', data);
  },
  // 提交作业
  submitWork: (data) => {
    return request.post('/homework/submitWork', data);
  },
  // 获取待批改学生列表
  getStudentListForCorrection: (homeworkId) => {
    return request.get(`/homework/Correction/${homeworkId}`);
  },
  // 提交批改
  submitCorrection: (data) => {
    return request.post('/homework/saveCorrection', data);
  },
  // 获取成绩统计数据
  getDashboard: () => {
    return request.get('/homework/dashboard');
  },
  // 查询学生作业提交情况
  queryStudentAnswer: (homeworkId) => {
    return request.post('/homework/queryStudentAnswer', { homeworkId });
  },
  // 查询单个学生作答详情
  queryStudentAnswerDetail: (data) => {
    return request.post('/homework/queryStudentAnswerDetail', data);
  },
  // AI 作业分析
  analyze: (homeworkId) => {
    return request.post('/homework/analyze', { homeworkId });
  },
  // 查询历史 AI 分析报告
  queryHomeworkReport: (homeworkId) => {
    return request.post('/homework/queryHomeworkReport', { homeworkId });
  },
  // 智能选题并发布作业
  smartPublish: (data) => {
    return request.post('/homework/smartPublish', data);
  }
};

export default {
  user: userApi,
  clazz: clazzApi,
  course: courseApi,
  question: questionApi,
  homework: homeworkApi
};