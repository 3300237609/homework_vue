<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">课表管理</h2>
    </div>

    <div class="filter-bar">
      <div class="filter-left">
        <input v-model="searchForm.teacherId" type="number" placeholder="教师ID" class="filter-input" />
        <input v-model="searchForm.clazzId" type="number" placeholder="班级ID" class="filter-input" />
        <button class="btn btn-primary" @click="loadCourseList">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          搜索
        </button>
        <button class="btn btn-secondary" @click="resetSearch">重置</button>
      </div>
      <button class="btn btn-add" @click="openAddDialog">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        新设课程
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 20%;">
          <col style="width: 100px;">
          <col style="width: 15%;">
          <col style="width: 100px;">
          <col style="width: 150px;">
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>课程名称</th>
            <th>教师ID</th>
            <th>教师名字</th>
            <th>班级ID</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courseList" :key="course.id">
            <td>{{ course.id }}</td>
            <td class="text-ellipsis">{{ course.courseName }}</td>
            <td>{{ course.teacherId }}</td>
            <td class="text-ellipsis">{{ course.teacherName || '-' }}</td>
            <td>{{ course.clazzId || '-' }}</td>
            <td class="action-column">
              <button class="action-btn edit" @click="openEditDialog(course)">编辑</button>
              <button class="action-btn delete" @click="deleteCourse(course.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">共 {{ pagination.total }} 条记录</div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="pagination.pageNum <= 1" @click="handleCurrentChange(pagination.pageNum - 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <span class="page-indicator">第 {{ pagination.pageNum }} / {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="pagination.pageNum >= totalPages" @click="handleCurrentChange(pagination.pageNum + 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    </div>

    <div class="dialog-overlay" v-if="dialogVisible" @click.self="dialogVisible = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>{{ dialogTitle }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>课程名称</label>
            <select v-model="formData.courseName" class="form-select">
              <option value="">请选择课程</option>
              <option v-for="course in courseNameList" :key="course.id" :value="course.courseName">
                {{ course.courseName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>教师ID</label>
            <input v-model="formData.teacherId" type="number" placeholder="请输入教师ID" class="form-input" @change="handleTeacherIdChange" />
            <div v-if="teacherName" :class="teacherNameValid ? 'teacher-name-valid' : 'teacher-name-invalid'">{{ teacherName }}</div>
          </div>
          <div class="form-group">
            <label>班级ID</label>
            <input v-model="formData.clazzId" type="number" placeholder="请输入班级ID" class="form-input" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="submitForm" :disabled="!teacherNameValid && formData.teacherId">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { courseApi, userApi } from '../../api/api';

const dialogVisible = ref(false);
const dialogTitle = ref('新设课程');
const searchForm = ref({ teacherId: '', clazzId: '' });
const formData = ref({ id: '', courseName: '', teacherId: '', clazzId: '' });
const teacherName = ref('');
const teacherNameValid = ref(true);
const courseList = ref([]);
const courseNameList = ref([]);
const pagination = ref({ total: 0, pages: 1, pageSize: 10, pageNum: 1 });

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize) || 1);

const loadCourseList = async () => {
  try {
    const params = { pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize };
    if (searchForm.value.teacherId) params.teacherId = searchForm.value.teacherId;
    if (searchForm.value.clazzId) params.clazzId = searchForm.value.clazzId;
    const response = await courseApi.getCourseList(params);
    if (response.code === 1) {
      courseList.value = response.data || [];
      if (response.map) { pagination.value.total = response.map.total || 0; pagination.value.pages = response.map.pages || 1; pagination.value.pageSize = response.map.pageSize || 10; pagination.value.pageNum = response.map.pageNum || 1; }
    } else { alert('获取课程列表失败'); }
  } catch (error) { console.error('获取课程列表错误:', error); alert('网络错误'); }
};

const loadCourseNameList = async () => {
  try {
    const response = await courseApi.getAllCourseNames();
    if (response.code === 1) {
      courseNameList.value = response.data || [];
    }
  } catch (error) {
    console.error('获取课程名称列表失败:', error);
  }
};

const resetSearch = () => { searchForm.value = { teacherId: '', clazzId: '' }; pagination.value.pageNum = 1; loadCourseList(); };
const handleCurrentChange = (current) => { pagination.value.pageNum = current; loadCourseList(); };
const handleSizeChange = () => { pagination.value.pageNum = 1; loadCourseList(); };

const handleTeacherIdChange = async () => {
  const teacherId = formData.value.teacherId;
  if (!teacherId) { teacherName.value = ''; teacherNameValid.value = true; return; }
  try {
    const response = await userApi.getNameById(teacherId);
    if (response.code === 1) { teacherName.value = response.data || '未知'; teacherNameValid.value = true; }
    else { teacherName.value = response.msg || '教师不存在'; teacherNameValid.value = false; }
  } catch (error) { teacherName.value = '查询失败'; teacherNameValid.value = false; }
};

const openAddDialog = async () => {
  formData.value = { id: '', courseName: '', teacherId: '', clazzId: '' };
  teacherName.value = '';
  teacherNameValid.value = true;
  dialogTitle.value = '新设课程';
  await loadCourseNameList();
  dialogVisible.value = true;
};

const openEditDialog = (course) => {
  formData.value = { id: course.id, courseName: course.courseName, teacherId: course.teacherId || '', clazzId: course.clazzId || '' };
  teacherName.value = '';
  teacherNameValid.value = true;
  dialogTitle.value = '编辑课程';
  loadCourseNameList();
  dialogVisible.value = true;
};

const closeDialog = () => { dialogVisible.value = false; };

const deleteCourse = async (id) => {
  if (!confirm('确定要删除这个课程吗？')) return;
  try {
    const response = await courseApi.deleteCourse(id);
    if (response.code === 1) { alert('删除课程成功'); loadCourseList(); } else { alert('删除课程失败'); }
  } catch (error) { alert('网络错误'); }
};

const submitForm = async () => {
  try {
    if (!formData.value.courseName) {
      alert('课程名称为必填项');
      return;
    }
    console.log('提交的数据:', formData.value);
    let response;
    if (formData.value.id) {
      response = await courseApi.updateCourse(formData.value);
    } else {
      response = await courseApi.addCourse(formData.value);
    }
    console.log('响应结果:', response);
    if (response.code === 1) {
      alert('操作成功');
      closeDialog();
      loadCourseList();
    } else {
      alert(response.msg || '操作失败');
    }
  } catch (error) {
    console.error('提交失败:', error);
    alert('网络错误: ' + error.message);
  }
};

onMounted(() => { loadCourseList(); });
</script>

<style scoped>
.page-container {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header { margin-bottom: 24px; }

.page-title { font-size: 1.5rem; font-weight: 600; color: #1a1a2e; }

.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-radius: 12px; }

.filter-left { display: flex; gap: 12px; align-items: center; }

.filter-input {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.9rem;
  background-color: #fff;
  transition: all 0.3s ease;
}

.filter-input:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }

.btn-primary { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }

.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary { background-color: #f0f0f0; color: #666; }

.btn-secondary:hover { background-color: #e0e0e0; }

.btn-add { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }

.btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }

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

.data-table tr:hover { background-color: #f8fafc; }

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.action-btn:first-child { margin-left: 0; }

.action-btn.edit { background-color: #e4f0ff; color: #4a90e2; }

.action-btn.edit:hover { background-color: #4a90e2; color: white; }

.action-btn.delete { background-color: #ffe4e4; color: #ff6b6b; }

.action-btn.delete:hover { background-color: #ff6b6b; color: white; }

.pagination-container { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; }

.pagination-info { color: #999; font-size: 0.9rem; }

.pagination-controls { display: flex; align-items: center; gap: 12px; }

.page-size-select {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.9rem;
  background-color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 36px;
  min-width: 100px;
  transition: all 0.3s ease;
}

.page-size-select:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.page-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 2px solid #eee; border-radius: 8px; background-color: #fff; cursor: pointer; transition: all 0.3s ease; }

.page-btn:hover:not(:disabled) { border-color: #50C9C3; color: #50C9C3; }

.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.page-indicator { font-size: 0.9rem; color: #666; }

.dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }

.dialog { background-color: #fff; border-radius: 16px; width: 480px; max-width: 90%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); }

.dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }

.dialog-header h3 { font-size: 1.2rem; font-weight: 600; color: #1a1a2e; }

.dialog-close { background: none; border: none; cursor: pointer; color: #999; padding: 4px; transition: color 0.3s ease; }

.dialog-close:hover { color: #333; }

.dialog-body { padding: 24px; }

.dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid #eee; }

.form-group { margin-bottom: 20px; }

.form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #333; }

.form-input { width: 100%; padding: 12px 14px; border: 2px solid #eee; border-radius: 10px; font-size: 0.95rem; transition: all 0.3s ease; }

.form-input:focus { outline: none; border-color: #50C9C3; box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1); }

.form-select {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  background-color: #fff;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 36px;
  transition: all 0.3s ease;
}

.form-select:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.teacher-name-valid { color: #67c23a; font-size: 14px; margin-top: 8px; }

.teacher-name-invalid { color: #f56c6c; font-size: 14px; margin-top: 8px; }
</style>