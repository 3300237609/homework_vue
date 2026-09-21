<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">课程管理</h2>
    </div>

    <div class="action-bar">
      <button class="btn btn-add" @click="openAddDialog">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        添加课程
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <colgroup>
          <col style="width: 80px;">
          <col style="flex: 1;">
          <col style="width: 120px;">
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>课程名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courseList" :key="course.id">
            <td>{{ course.id }}</td>
            <td class="text-ellipsis">{{ course.courseName }}</td>
            <td class="action-column">
              <button class="action-btn delete" @click="deleteCourse(course.id)">删除</button>
            </td>
          </tr>
          <tr v-if="courseList.length === 0">
            <td colspan="3" class="empty-row">暂无课程数据</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="dialog-overlay" v-if="dialogVisible" @click.self="dialogVisible = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>添加课程</h3>
          <button class="dialog-close" @click="dialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>课程名称</label>
            <input v-model="formData.courseName" type="text" placeholder="请输入课程名称" class="form-input" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="submitForm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { courseApi } from '../../api/api';

const dialogVisible = ref(false);
const formData = ref({ courseName: '' });
const courseList = ref([]);

const loadCourseList = async () => {
  try {
    const response = await courseApi.getAllCourseList();
    if (response.code === 1) {
      courseList.value = response.data || [];
    } else {
      alert('获取课程列表失败');
    }
  } catch (error) {
    console.error('获取课程列表错误:', error);
    alert('网络错误');
  }
};

const openAddDialog = () => {
  formData.value = { courseName: '' };
  dialogVisible.value = true;
};

const deleteCourse = async (id) => {
  if (!confirm('确定要删除这个课程吗？')) return;
  try {
    const response = await courseApi.removeCourse(id);
    if (response.code === 1) {
      alert('删除课程成功');
      loadCourseList();
    } else {
      alert('删除课程失败');
    }
  } catch (error) {
    alert('网络错误');
  }
};

const submitForm = async () => {
  try {
    if (!formData.value.courseName.trim()) {
      alert('课程名称为必填项');
      return;
    }
    const response = await courseApi.addNewCourse({ courseName: formData.value.courseName });
    if (response.code === 1) {
      alert('添加课程成功');
      dialogVisible.value = false;
      loadCourseList();
    } else {
      alert(response.msg || '添加课程失败');
    }
  } catch (error) {
    alert('网络错误');
  }
};

onMounted(() => {
  loadCourseList();
});
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a2e;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4);
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #666;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-add {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4);
}

.table-container {
  overflow-x: hidden;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 14px 12px;
  font-size: 0.9rem;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #eee;
  text-align: center;
}

.data-table td {
  color: #333;
  text-align: center;
}

.data-table tr:hover {
  background-color: #f8fafc;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-row {
  text-align: center;
  color: #999;
  padding: 40px;
}

.action-column {
  text-align: right;
  padding-right: 16px;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.action-btn.delete {
  background-color: #ffe4e4;
  color: #ff6b6b;
}

.action-btn.delete:hover {
  background-color: #ff6b6b;
  color: white;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background-color: #fff;
  border-radius: 16px;
  width: 480px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.dialog-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a2e;
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  transition: color 0.3s ease;
}

.dialog-close:hover {
  color: #333;
}

.dialog-body {
  padding: 24px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}
</style>