<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">用户管理</h2>
    </div>

    <div class="filter-bar">
      <div class="filter-left">
        <select v-model="searchForm.role" class="filter-select">
          <option value="">全部角色</option>
          <option value="管理员">管理员</option>
          <option value="教师">教师</option>
          <option value="学生">学生</option>
        </select>
        <input v-model="searchForm.clazz" type="text" placeholder="班级ID" class="filter-input" />
        <button class="btn btn-primary" @click="loadUserList">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          搜索
        </button>
        <button class="btn btn-secondary" @click="resetSearch">重置</button>
      </div>
      <button class="btn btn-add" @click="openAddDialog">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        添加用户
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <colgroup>
          <col style="width: 80px;">
          <col style="width: 18%;">
          <col style="width: 15%;">
          <col style="width: 100px;">
          <col style="width: 100px;">
          <col style="width: 18%;">
          <col style="width: 150px;">
        </colgroup>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>姓名</th>
            <th>角色</th>
            <th>班级ID</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userList" :key="user.id">
            <td>{{ user.id }}</td>
            <td class="text-ellipsis">{{ user.username }}</td>
            <td>{{ user.name }}</td>
            <td><span class="role-badge" :class="'role-' + user.roleId">{{ getRoleName(user.roleId) }}</span></td>
            <td>{{ user.clazzId || '-' }}</td>
            <td class="text-ellipsis">{{ user.createTime }}</td>
            <td class="action-column">
              <button class="action-btn edit" @click="openEditDialog(user)">编辑</button>
              <button class="action-btn delete" @click="deleteUser(user.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">
        共 {{ pagination.total }} 条记录
      </div>
      <div class="pagination-controls">
        <button class="page-btn" :disabled="pagination.pageNum <= 1" @click="handleCurrentChange(pagination.pageNum - 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span class="page-indicator">第 {{ pagination.pageNum }} / {{ totalPages }} 页</span>
        <button class="page-btn" :disabled="pagination.pageNum >= totalPages" @click="handleCurrentChange(pagination.pageNum + 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <div class="dialog-overlay" v-if="dialogVisible" @click.self="closeDialog">
      <div class="dialog">
        <div class="dialog-header">
          <h3>{{ dialogTitle }}</h3>
          <button class="dialog-close" @click="closeDialog">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="formData.username" type="text" placeholder="请输入用户名" class="form-input" />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="formData.password" type="password" placeholder="请输入密码" class="form-input" />
          </div>
          <div class="form-group">
            <label>姓名</label>
            <input v-model="formData.name" type="text" placeholder="请输入姓名" class="form-input" />
          </div>
          <div class="form-group">
            <label>角色</label>
            <select v-model="formData.roleId" class="form-select">
              <option :value="1">管理员</option>
              <option :value="2">教师</option>
              <option :value="3">学生</option>
            </select>
          </div>
          <div class="form-group">
            <label>班级ID</label>
            <input v-model="formData.clazzId" type="number" placeholder="请输入班级ID" class="form-input" />
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="closeDialog">取消</button>
          <button class="btn btn-primary" @click="submitForm">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { userApi } from '../../api/api';

const dialogVisible = ref(false);
const dialogTitle = ref('添加用户');

const searchForm = ref({
  role: '',
  clazz: ''
});

const formData = ref({
  id: '',
  username: '',
  password: '',
  name: '',
  roleId: 1,
  clazzId: ''
});

const userList = ref([]);

const pagination = ref({
  total: 0,
  pages: 1,
  pageSize: 10,
  pageNum: 1
});

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize) || 1);

const getRoleName = (roleId) => {
  const roles = { 1: '管理员', 2: '教师', 3: '学生' };
  return roles[roleId] || '未知';
};

const loadUserList = async () => {
  try {
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize
    };
    if (searchForm.value.role) params.role = searchForm.value.role;
    if (searchForm.value.clazz) params.clazzId = searchForm.value.clazz;

    const response = await userApi.getUserList(params);
    if (response.code === 1) {
      userList.value = response.data || [];
      if (response.map) {
        pagination.value.total = response.map.total || 0;
        pagination.value.pages = response.map.pages || 1;
        pagination.value.pageSize = response.map.pageSize || 10;
        pagination.value.pageNum = response.map.pageNum || 1;
      }
    } else {
      alert('获取用户列表失败');
    }
  } catch (error) {
    console.error('获取用户列表错误:', error);
    alert('网络错误');
  }
};

const resetSearch = () => {
  searchForm.value = { role: '', clazz: '' };
  pagination.value.pageNum = 1;
  loadUserList();
};

const openAddDialog = () => {
  formData.value = { id: '', username: '', password: '', name: '', roleId: 1, clazzId: '' };
  dialogTitle.value = '添加用户';
  dialogVisible.value = true;
};

const openEditDialog = (user) => {
  formData.value = {
    id: user.id,
    username: user.username,
    password: '',
    name: user.name,
    roleId: user.roleId,
    clazzId: user.clazzId || ''
  };
  dialogTitle.value = '编辑用户';
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const deleteUser = async (id) => {
  if (!confirm('确定要删除这个用户吗？')) return;
  try {
    const response = await userApi.deleteUser(id);
    if (response.code === 1) {
      alert('删除用户成功');
      loadUserList();
    } else {
      alert('删除用户失败');
    }
  } catch (error) {
    console.error('删除用户错误:', error);
    alert('网络错误');
  }
};

const submitForm = async () => {
  try {
    if (!formData.value.username || !formData.value.name) {
      alert('用户名和姓名为必填项');
      return;
    }
    if (!formData.value.id && !formData.value.password) {
      alert('添加用户时密码为必填项');
      return;
    }

    let response;
    if (formData.value.id) {
      response = await userApi.updateUser(formData.value);
    } else {
      response = await userApi.register(formData.value);
    }

    if (response.code === 1) {
      alert('操作成功');
      closeDialog();
      loadUserList();
    } else {
      alert(response.msg || '操作失败');
    }
  } catch (error) {
    console.error('提交表单错误:', error);
    alert('网络错误');
  }
};

const handleSizeChange = () => {
  pagination.value.pageNum = 1;
  loadUserList();
};

const handleCurrentChange = (current) => {
  pagination.value.pageNum = current;
  loadUserList();
};

onMounted(() => {
  loadUserList();
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 12px;
}

.filter-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-select,
.filter-input {
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.9rem;
  background-color: #fff;
  transition: all 0.3s ease;
  min-width: 120px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.filter-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 36px;
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

.btn-primary:hover {
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

.action-column {
  text-align: right;
  padding-right: 16px;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.role-1 { background-color: #ffe4e4; color: #ff6b6b; }
.role-2 { background-color: #e4f0ff; color: #4a90e2; }
.role-3 { background-color: #e4ffe4; color: #67c23a; }

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

.action-btn:first-child {
  margin-left: 0;
}

.action-btn.edit {
  background-color: #e4f0ff;
  color: #4a90e2;
}

.action-btn.edit:hover {
  background-color: #4a90e2;
  color: white;
}

.action-btn.delete {
  background-color: #ffe4e4;
  color: #ff6b6b;
}

.action-btn.delete:hover {
  background-color: #ff6b6b;
  color: white;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}

.pagination-info {
  color: #999;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

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

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #50C9C3;
  color: #50C9C3;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  font-size: 0.9rem;
  color: #666;
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

.form-input,
.form-select {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #eee;
}
</style>