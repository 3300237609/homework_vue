<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">题目管理</h2>
    </div>

    <div class="filter-bar">
      <div class="filter-left">
        <input v-model="searchForm.keyword" type="text" placeholder="关键词" class="filter-input" />
        <input v-model="searchForm.courseId" type="text" placeholder="课程ID" class="filter-input" />
        <select v-model="searchForm.type" class="filter-select">
          <option value="">全部类型</option>
          <option value="单选">单选</option>
          <option value="多选">多选</option>
          <option value="判断">判断</option>
          <option value="简答">简答</option>
        </select>
        <select v-model="searchForm.difficulty" class="filter-select">
          <option value="">全部难度</option>
          <option value="简单">简单</option>
          <option value="中等">中等</option>
          <option value="困难">困难</option>
        </select>
        <button class="btn btn-primary" @click="handleSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          搜索
        </button>
        <button class="btn btn-secondary" @click="resetSearch">重置</button>
      </div>
      <div class="filter-right">
        <button class="btn btn-add" @click="dialogVisible = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          添加题目
        </button>
        <button class="btn btn-add-secondary" @click="batchDialogVisible = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
          批量添加
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>题目</th>
            <th>类型</th>
            <th>分数</th>
            <th>难度</th>
            <th>课程ID</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="q in questionList" :key="q.id">
            <td>{{ q.id }}</td>
            <td class="title-cell">{{ q.title }}</td>
            <td><span class="type-badge">{{ q.type }}</span></td>
            <td>{{ q.score }}</td>
            <td><span class="difficulty-badge" :class="'diff-' + q.difficulty">{{ q.difficulty || '-' }}</span></td>
            <td>{{ q.courseId }}</td>
            <td>{{ q.createTime }}</td>
            <td>
              <button class="action-btn view" @click="viewQuestionDetail(q.id)">查看</button>
              <button class="action-btn delete" @click="deleteQuestion(q.id)">删除</button>
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
      <div class="dialog dialog-large">
        <div class="dialog-header">
          <h3>{{ dialogTitle }}</h3>
          <button class="dialog-close" @click="dialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-row">
            <div class="form-group">
              <label>课程ID</label>
              <input v-model="formData.courseId" type="number" placeholder="请输入课程ID" class="form-input" />
            </div>
            <div class="form-group">
              <label>类型</label>
              <select v-model="formData.type" @change="handleTypeChange" class="form-select">
                <option value="单选">单选</option>
                <option value="多选">多选</option>
                <option value="判断">判断</option>
                <option value="简答">简答</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>题目</label>
            <textarea v-model="formData.title" rows="3" placeholder="请输入题目内容" class="form-textarea"></textarea>
          </div>
          <div class="form-group" v-if="formData.type === '判断'">
            <label>选项</label>
            <div class="options-grid">
              <input v-model="formData.options.T" placeholder="正确" class="form-input" />
              <input v-model="formData.options.F" placeholder="错误" class="form-input" />
            </div>
          </div>
          <div class="form-group" v-else-if="formData.type !== '简答'">
            <label>选项</label>
            <div class="options-grid">
              <input v-model="formData.options.A" placeholder="选项A" class="form-input" />
              <input v-model="formData.options.B" placeholder="选项B" class="form-input" />
              <input v-model="formData.options.C" placeholder="选项C" class="form-input" />
              <input v-model="formData.options.D" placeholder="选项D" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>答案</label>
            <select v-if="formData.type === '判断' || formData.type === '单选'" v-model="formData.answer" class="form-select">
              <option v-if="formData.type === '判断'" value="T">正确</option>
              <option v-if="formData.type === '判断'" value="F">错误</option>
              <option v-if="formData.type === '单选'" value="A">A</option>
              <option v-if="formData.type === '单选'" value="B">B</option>
              <option v-if="formData.type === '单选'" value="C">C</option>
              <option v-if="formData.type === '单选'" value="D">D</option>
            </select>
            <input v-else v-model="formData.answer" placeholder="请输入答案" class="form-input" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>分数</label>
              <input v-model="formData.score" type="number" placeholder="分数" class="form-input" />
            </div>
            <div class="form-group">
              <label>难度</label>
              <select v-model="formData.difficulty" class="form-select">
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="submitForm">确定</button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay" v-if="batchDialogVisible" @click.self="batchDialogVisible = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>批量添加题目</h3>
          <button class="dialog-close" @click="batchDialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label>课程ID</label>
            <input v-model="batchFormData.courseId" type="number" placeholder="请输入课程ID" class="form-input" />
          </div>
          <div class="form-group">
            <label>题目列表</label>
            <textarea v-model="batchFormData.questions" rows="10" placeholder="请输入题目列表，每个题目占一行" class="form-textarea"></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="batchDialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="batchAddQuestion">确定</button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay" v-if="detailDialogVisible" @click.self="detailDialogVisible = false">
      <div class="dialog dialog-large">
        <div class="dialog-header">
          <h3>题目详情</h3>
          <button class="dialog-close" @click="detailDialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="detail-item"><span class="detail-label">课程ID：</span>{{ detailData.courseId }}</div>
          <div class="detail-item"><span class="detail-label">题目：</span>{{ detailData.title }}</div>
          <div class="detail-item"><span class="detail-label">类型：</span>{{ detailData.type }}</div>
          <div class="detail-item" v-if="detailData.options">
            <span class="detail-label">选项：</span>
            <div class="options-display">
              <div v-for="(value, key) in parseOptions(detailData.options)" :key="key">{{ key }}: {{ value }}</div>
            </div>
          </div>
          <div class="detail-item"><span class="detail-label">答案：</span>{{ detailData.answer }}</div>
          <div class="detail-item"><span class="detail-label">分数：</span>{{ detailData.score }}</div>
          <div class="detail-item"><span class="detail-label">难度：</span>{{ detailData.difficulty || '-' }}</div>
          <div class="detail-item"><span class="detail-label">创建时间：</span>{{ detailData.createTime || '-' }}</div>
          <div class="detail-item"><span class="detail-label">更新时间：</span>{{ detailData.updateTime || '-' }}</div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="detailDialogVisible = false">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { questionApi } from '../../api/api';

const dialogVisible = ref(false);
const batchDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const dialogTitle = ref('添加题目');

const formData = ref({ id: '', courseId: '', title: '', type: '单选', options: { A: '', B: '', C: '', D: '' }, answer: '', score: '', difficulty: '简单' });
const batchFormData = ref({ courseId: '', questions: '' });
const detailData = ref({ id: '', courseId: '', title: '', type: '', options: '', answer: '', score: '', difficulty: '', createTime: '', updateTime: '' });
const searchForm = ref({ keyword: '', courseId: '', type: '', difficulty: '' });
const questionList = ref([]);
const pagination = ref({ total: 0, pages: 1, pageSize: 10, pageNum: 1 });

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize) || 1);

const parseOptions = (options) => {
  if (!options) return {};
  try { return typeof options === 'string' ? JSON.parse(options) : options; } catch { return {}; }
};

const loadQuestionList = async () => {
  try {
    const params = { ...searchForm.value, pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize };
    const response = await questionApi.getQuestionList(params);
    if (response.code === 1) {
      questionList.value = response.data;
      if (response.map) { pagination.value.total = response.map.total || 0; pagination.value.pages = response.map.pages || 1; pagination.value.pageSize = response.map.pageSize || 10; pagination.value.pageNum = response.map.pageNum || 1; }
    } else { alert('获取题目列表失败'); }
  } catch (error) { console.error('获取题目列表错误:', error); alert('网络错误'); }
};

const handleSearch = () => { pagination.value.pageNum = 1; loadQuestionList(); };
const resetSearch = () => { searchForm.value = { keyword: '', courseId: '', type: '', difficulty: '' }; pagination.value.pageNum = 1; loadQuestionList(); };
const handleCurrentChange = (current) => { pagination.value.pageNum = current; loadQuestionList(); };
const handleSizeChange = () => { pagination.value.pageNum = 1; loadQuestionList(); };

const handleTypeChange = (event) => {
  const value = event.target.value;
  if (value === '判断') {
    formData.value.options = { T: '', F: '' };
  } else if (value === '简答') {
    formData.value.options = {};
  } else {
    formData.value.options = { A: '', B: '', C: '', D: '' };
  }
  formData.value.answer = '';
};

const viewQuestionDetail = async (id) => {
  try {
    const response = await questionApi.getQuestionDetail({ questionId: id });
    if (response.code === 1) { detailData.value = response.data; detailDialogVisible.value = true; }
    else { alert('获取题目详情失败'); }
  } catch (error) { alert('网络错误'); }
};

const deleteQuestion = async (questionId) => {
  if (!confirm('确定要删除该题目吗？此操作不可撤销。')) {
    return;
  }
  try {
    const response = await questionApi.deleteQuestion(questionId);
    if (response.code === 1) {
      alert('删除成功');
      loadQuestionList();
    } else {
      alert(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除题目错误:', error);
    alert('网络错误');
  }
};

const submitForm = async () => {
  try {
    let options = { ...formData.value.options };
    if (formData.value.type === '判断') {
      options = { T: options.T || '', F: options.F || '' };
    } else if (formData.value.type !== '简答') {
      options = { A: options.A || '', B: options.B || '', C: options.C || '', D: options.D || '' };
    }
    const submitData = { ...formData.value, options: JSON.stringify(options) };
    const response = await questionApi.addQuestion(submitData);
    if (response.code === 1) { 
      alert('操作成功'); 
      dialogVisible.value = false; 
      formData.value = { id: '', courseId: '', title: '', type: '单选', options: { A: '', B: '', C: '', D: '' }, answer: '', score: '', difficulty: '简单' }; 
      loadQuestionList(); 
    } else { 
      alert('操作失败'); 
    }
  } catch (error) { 
    alert('网络错误'); 
  }
};

const batchAddQuestion = async () => {
  try {
    const response = await questionApi.batchAddQuestion(batchFormData.value);
    if (response.code === 1) { alert('批量添加题目成功'); batchDialogVisible.value = false; batchFormData.value = { courseId: '', questions: '' }; loadQuestionList(); }
    else { alert('批量添加题目失败'); }
  } catch (error) { alert('网络错误'); }
};

onMounted(() => { loadQuestionList(); });
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
.filter-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px; background-color: #f8fafc; border-radius: 12px; flex-wrap: wrap; gap: 12px; }
.filter-left { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.filter-right { display: flex; gap: 10px; }
.filter-input, .filter-select { padding: 10px 14px; border: 2px solid #eee; border-radius: 10px; font-size: 0.9rem; background-color: #fff; transition: all 0.3s ease; min-width: 120px; }
.filter-input:focus, .filter-select:focus { outline: none; border-color: #50C9C3; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.btn-primary { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }
.btn-secondary { background-color: #f0f0f0; color: #666; }
.btn-secondary:hover { background-color: #e0e0e0; }
.btn-add { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }
.btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }
.btn-add-secondary { background: linear-gradient(135deg, #67c23a 0%, #5daf34 100%); color: white; box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3); }
.btn-add-secondary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4); }
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 14px 16px;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #666;
  border-bottom: 2px solid #eee;
}

.data-table td {
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}
.data-table tr:hover { background-color: #f8fafc; }
.title-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.type-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background-color: #e4f0ff; color: #4a90e2; }
.difficulty-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
.diff-简单 { background-color: #e4ffe4; color: #67c23a; }
.diff-中等 { background-color: #fff4e4; color: #e6a23c; }
.diff-困难 { background-color: #ffe4e4; color: #f56c6c; }
.action-btn { padding: 6px 14px; border: none; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; }
.action-btn.view { background-color: #e4f0ff; color: #4a90e2; }
.action-btn.view:hover { background-color: #4a90e2; color: white; }
.action-btn.delete { background-color: #ffe4e4; color: #e53935; margin-left: 8px; }
.action-btn.delete:hover { background-color: #e53935; color: white; }
.pagination-container { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; flex-wrap: wrap; gap: 12px; }
.pagination-info { color: #999; font-size: 0.9rem; }
.pagination-controls { display: flex; align-items: center; gap: 12px; }
.page-size-select { padding: 8px 12px; border: 2px solid #eee; border-radius: 8px; font-size: 0.85rem; background-color: #fff; }
.page-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border: 2px solid #eee; border-radius: 8px; background-color: #fff; cursor: pointer; transition: all 0.3s ease; }
.page-btn:hover:not(:disabled) { border-color: #50C9C3; color: #50C9C3; }
.page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.page-indicator { font-size: 0.9rem; color: #666; }
.dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; overflow-y: auto; padding: 20px; }
.dialog { background-color: #fff; border-radius: 16px; width: 480px; max-width: 100%; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); }
.dialog-large { width: 600px; }
.dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #eee; }
.dialog-header h3 { font-size: 1.2rem; font-weight: 600; color: #1a1a2e; }
.dialog-close { background: none; border: none; cursor: pointer; color: #999; padding: 4px; transition: color 0.3s ease; }
.dialog-close:hover { color: #333; }
.dialog-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
.dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid #eee; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 500; color: #333; }
.form-input, .form-select, .form-textarea { width: 100%; padding: 12px 14px; border: 2px solid #eee; border-radius: 10px; font-size: 0.95rem; transition: all 0.3s ease; font-family: inherit; }
.form-input:focus, .form-select:focus, .form-textarea:focus { outline: none; border-color: #50C9C3; box-shadow: 0 0 0 4px rgba(80, 201, 195, 0.1); }
.form-textarea { resize: vertical; min-height: 80px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.detail-item { margin-bottom: 16px; font-size: 0.95rem; color: #333; }
.detail-label { font-weight: 500; color: #666; }
.options-display { margin-top: 8px; padding: 12px; background-color: #f8fafc; border-radius: 8px; }
.options-display div { margin-bottom: 4px; }
.options-display div:last-child { margin-bottom: 0; }
</style>