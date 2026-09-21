import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../vue/Dashboard.vue';
import Login from '../vue/Login.vue';
import Register from '../vue/Register.vue';
import Admin from '../vue/Admin.vue';
import Teacher from '../vue/Teacher.vue';
import Student from '../vue/Student.vue';
import UserManagement from '../vue/admin/UserManagement.vue';
import ClassManagement from '../vue/admin/ClassManagement.vue';
import CourseManagement from '../vue/admin/CourseManagement.vue';
import CourseManager from '../vue/admin/CourseManager.vue';
import QuestionManagement from '../vue/teacher/QuestionManagement.vue';
import HomeworkManagement from '../vue/teacher/HomeworkManagement.vue';
import HomeworkStatistics from '../vue/teacher/HomeworkStatistics.vue';
import Correction from '../vue/teacher/Correction.vue';
import TeacherHomeworkDetail from '../vue/teacher/HomeworkDetail.vue';
import HomeworkQuestions from '../vue/teacher/HomeworkQuestions.vue';
import AnswerDetail from '../vue/teacher/AnswerDetail.vue';
import HomeworkList from '../vue/student/HomeworkList.vue';
import HomeworkDetail from '../vue/student/HomeworkDetail.vue';
import AIChat from '../vue/student/AIChat.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'classes',
        name: 'ClassManagement',
        component: ClassManagement
      },
      {
        path: 'courses',
        name: 'CourseManagement',
        component: CourseManagement
      },
      {
        path: 'course-manager',
        name: 'CourseManager',
        component: CourseManager
      }
    ]
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: Teacher,
    children: [
      {
        path: 'statistics',
        name: 'HomeworkStatistics',
        component: HomeworkStatistics
      },
      {
        path: 'questions',
        name: 'QuestionManagement',
        component: QuestionManagement
      },
      {
        path: 'homework',
        name: 'HomeworkManagement',
        component: HomeworkManagement
      },
      {
        path: 'correction/:id',
        name: 'Correction',
        component: Correction
      },
      {
        path: 'detail/:id',
        name: 'TeacherHomeworkDetail',
        component: TeacherHomeworkDetail
      },
      {
        path: 'questions-view/:id',
        name: 'TeacherHomeworkQuestions',
        component: HomeworkQuestions
      },
      {
        path: 'answer-detail/:homeworkId/:studentId',
        name: 'TeacherAnswerDetail',
        component: AnswerDetail
      }
    ]
  },
  {
    path: '/student',
    name: 'Student',
    component: Student,
    children: [
      {
        path: 'homework',
        name: 'HomeworkList',
        component: HomeworkList
      }
    ]
  },
  {
    path: '/homework/student/detail/:id',
    name: 'HomeworkDetail',
    component: HomeworkDetail
  },
  {
    path: '/student/ai-chat',
    name: 'AIChat',
    component: AIChat
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;