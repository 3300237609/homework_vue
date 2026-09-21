<template>
  <div class="page-container">
    <div class="page-header">
      <h2 class="page-title">作业管理</h2>
    </div>

    <div class="filter-bar">
      <div class="filter-left">
        <input v-model="searchForm.clazzId" type="text" placeholder="班级ID" class="filter-input" />
        <input v-model="searchForm.courseId" type="text" placeholder="课程ID" class="filter-input" />
        <button class="btn btn-primary" @click="handleSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          搜索
        </button>
        <button class="btn btn-secondary" @click="resetSearch">重置</button>
      </div>
      <button class="btn btn-add" @click="openAddDialog">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        添加作业
      </button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>内容</th>
            <th>班级ID</th>
            <th>课程ID</th>
            <th>截止时间</th>
            <th>总分</th>
            <th>总人数</th>
            <th>已提交</th>
            <th>未提交</th>
            <th>已批改</th>
            <th>待批改</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hw in homeworkList" :key="hw.id">
            <td>{{ hw.id }}</td>
            <td class="title-cell">{{ hw.title }}</td>
            <td class="content-cell">{{ hw.content }}</td>
            <td>{{ hw.clazzId }}</td>
            <td>{{ hw.courseId }}</td>
            <td class="deadline-cell">
              <div class="deadline-time">{{ hw.deadline }}</div>
              <div class="countdown" :class="{ expired: isExpired(hw.deadline) }">
                {{ getCountdown(hw.deadline) }}
              </div>
            </td>
            <td>{{ hw.totalScore || '-' }}</td>
            <td>{{ hw.totalStudent || '-' }}</td>
            <td>
              <div class="pie-chart-container">
                <svg width="40" height="40" viewBox="0 0 40 40" class="pie-chart">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#e8e8e8" stroke-width="4"></circle>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#50C9C3" stroke-width="4" stroke-linecap="round" :stroke-dasharray="getPieChartDashArray(hw)"></circle>
                </svg>
                <span class="pie-label">{{ hw.submitCount || 0 }}/{{ hw.totalStudent || 0 }}</span>
              </div>
            </td>
            <td>{{ hw.unSubmitCount || '0' }}</td>
            <td>{{ hw.correctedCount || '0' }}</td>
            <td>
              <span class="uncorrect-count">{{ hw.unCorrectCount || '0' }}</span>
              <button 
                class="action-btn correct small" 
                :class="{ disabled: hw.unCorrectCount <= 0 }" 
                :disabled="hw.unCorrectCount <= 0"
                @click="goToCorrection(hw.id)"
              >去批改</button>
            </td>
            <td>
              <button class="action-btn view" @click="viewDetail(hw.id)">提交情况</button>
              <button class="action-btn edit" @click="viewQuestions(hw.id)">查看</button>
              <button class="action-btn delete" @click="deleteHomework(hw.id)">删除</button>
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
          <h3>添加作业</h3>
          <button class="dialog-close" @click="dialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-row">
            <div class="form-group">
              <label>标题</label>
              <input v-model="formData.title" type="text" placeholder="请输入作业标题" class="form-input" />
            </div>
            <div class="form-group">
              <label>班级ID</label>
              <input v-model="formData.clazzId" type="number" placeholder="请输入班级ID" class="form-input" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>课程ID</label>
              <input v-model="formData.courseId" type="number" placeholder="请输入课程ID" class="form-input" />
            </div>
            <div class="form-group">
              <label>截止时间</label>
              <input v-model="formData.deadline" type="datetime-local" class="form-input" />
            </div>
          </div>
          <div class="form-group">
            <label>作业内容</label>
            <textarea v-model="formData.content" rows="3" placeholder="请输入作业内容" class="form-textarea"></textarea>
          </div>
          <div class="form-group">
            <label>题目选择</label>
            <div class="question-selector">
              <div class="selector-header">
                <input v-model="questionKeyword" type="text" placeholder="关键词搜索" class="filter-input-small" />
                <input v-model="questionCourseId" type="number" placeholder="课程ID" class="filter-input-small" />
                <select v-model="questionType" class="filter-select-small">
                  <option value="">全部类型</option>
                  <option value="单选">单选</option>
                  <option value="多选">多选</option>
                  <option value="判断">判断</option>
                  <option value="简答">简答</option>
                </select>
                <button class="btn btn-small" @click="loadQuestionsForSelection">搜索</button>
                <button class="btn btn-small btn-reset" @click="resetQuestionFilter">重置</button>
              </div>
              <div class="question-stats">
                <span>已选：单选 {{ selectedStats.single }} 题 | 多选 {{ selectedStats.multiple }} 题 | 判断 {{ selectedStats.judge }} 题 | 简答 {{ selectedStats.essay }} 题</span>
                <span class="total-score">总分：{{ totalScore }}</span>
              </div>
              <div class="question-list">
                <div v-for="q in questionListForSelect" :key="q.id" class="question-item">
                  <div class="question-info">
                    <input type="checkbox" :checked="isSelected(q.id)" @change="toggleQuestion(q)" />
                    <span class="question-title">{{ q.title }}</span>
                    <span class="question-type">{{ q.type }}</span>
                    <span class="question-score">默认 {{ q.score }} 分</span>
                  </div>
                  <div v-if="isSelected(q.id)" class="score-input">
                    <input type="number" :value="getQuestionScore(q.id)" @input="updateQuestionScore(q.id, $event)" placeholder="分值" class="score-input-field" />
                  </div>
                </div>
              </div>
              <div class="pagination-small">
                <button class="page-btn-small" :disabled="questionPage <= 1" @click="questionPage--; loadQuestionsForSelection()">上一页</button>
                <span>{{ questionPage }} / {{ questionTotalPages }}</span>
                <button class="page-btn-small" :disabled="questionPage >= questionTotalPages" @click="questionPage++; loadQuestionsForSelection()">下一页</button>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer dialog-footer-between">
          <button class="btn btn-smart" @click="openSmartDialog">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
            智能选题
          </button>
          <div class="footer-right">
            <button class="btn btn-secondary" @click="dialogVisible = false">取消</button>
            <button class="btn btn-primary" @click="submitHomework">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 智能选题弹窗 -->
    <div class="dialog-overlay smart-overlay" v-if="smartDialogVisible" @click.self="smartDialogVisible = false">
      <div class="dialog dialog-smart">
        <div class="dialog-header">
          <h3>🤖 智能选题</h3>
          <button class="dialog-close" @click="smartDialogVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="smart-row">
            <div class="form-group">
              <label>总分</label>
              <div class="input-suffix">
                <input v-model.number="smartForm.totalScore" type="number" min="1" class="form-input" placeholder="请输入总分" />
                <span class="suffix-text">分</span>
              </div>
            </div>
            <div class="form-group">
              <label>总题数</label>
              <div class="input-suffix">
                <input v-model.number="smartForm.questionCount" type="number" min="1" class="form-input" placeholder="请输入总题数" />
                <span class="suffix-text">题</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label>难度</label>
            <div class="difficulty-options">
              <button
                v-for="d in ['简单', '中等', '困难']"
                :key="d"
                type="button"
                class="difficulty-btn"
                :class="{ active: smartForm.difficulty === d }"
                @click="smartForm.difficulty = d"
              >{{ d }}</button>
            </div>
          </div>
          <div class="form-group">
            <label>题型占比</label>
            <div class="percent-list">
              <div class="percent-item">
                <span class="percent-label">选择题</span>
                <div class="input-suffix percent-input-wrap">
                  <input v-model.number="smartForm.choicePercent" type="number" min="0" max="100" class="form-input" />
                  <span class="suffix-text">%</span>
                </div>
              </div>
              <div class="percent-item">
                <span class="percent-label">判断题</span>
                <div class="input-suffix percent-input-wrap">
                  <input v-model.number="smartForm.judgePercent" type="number" min="0" max="100" class="form-input" />
                  <span class="suffix-text">%</span>
                </div>
              </div>
              <div class="percent-item">
                <span class="percent-label">简答题</span>
                <div class="input-suffix percent-input-wrap">
                  <input v-model.number="smartForm.essayPercent" type="number" min="0" max="100" class="form-input" />
                  <span class="suffix-text">%</span>
                </div>
              </div>
            </div>
            <div class="percent-footer">
              <div class="percent-sum" :class="{ invalid: percentSum !== 100 }">
                占比合计：{{ percentSum }}%<span v-if="percentSum !== 100">（需等于 100%）</span>
              </div>
              <button type="button" class="btn btn-outline" @click="balancePercent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"></path>
                  <path d="M3 12h18"></path>
                  <path d="M3 18h18"></path>
                </svg>
                一键配平
              </button>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="smartDialogVisible = false">取消</button>
          <button class="btn btn-primary" :class="{ 'btn-loading': smartGenerating }" @click="generateSmartQuestions">
            {{ smartGenerating ? '智能发布中，请耐心等待...' : '智能发布' }}
          </button>
        </div>
      </div>
    </div>

    <div class="dialog-overlay" v-if="detailVisible" @click.self="detailVisible = false">
      <div class="dialog dialog-large">
        <div class="dialog-header">
          <h3>作业详情</h3>
          <button class="dialog-close" @click="detailVisible = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="detail-item">
            <span class="detail-label">作业标题：</span>
            <span class="detail-content">{{ currentHomework.title }}</span>
          </div>
          <div class="detail-item detail-item-textarea">
            <span class="detail-label">作业要求：</span>
            <textarea v-model="currentHomework.content" rows="4" class="form-textarea"></textarea>
          </div>
          <div class="detail-item">
            <span class="detail-label">班级ID：</span>
            <span class="detail-content">{{ currentHomework.clazzId }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">课程ID：</span>
            <span class="detail-content">{{ currentHomework.courseId }}</span>
          </div>
          <div class="detail-item detail-item-input">
            <span class="detail-label">截止时间：</span>
            <input v-model="currentHomework.deadline" type="datetime-local" class="form-input" />
          </div>
          <div class="detail-item">
            <span class="detail-label">总分：</span>
            <span class="detail-content">{{ currentHomework.totalScore }}</span>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn btn-secondary" @click="detailVisible = false">关闭</button>
          <button class="btn btn-primary" @click="updateHomework">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { homeworkApi, questionApi } from '../../api/api';
import { useQuestionStore } from '../../store/questionStore';

const questionStore = useQuestionStore();
const router = useRouter();

const dialogVisible = ref(false);
const detailVisible = ref(false);
const smartDialogVisible = ref(false);
const smartGenerating = ref(false);
const smartForm = ref({
  totalScore: 100,
  questionCount: 10,
  difficulty: '中等',
  choicePercent: 100,
  judgePercent: 0,
  essayPercent: 0
});
const searchForm = ref({ clazzId: '', courseId: '' });
const formData = ref({ title: '', content: '', clazzId: '', courseId: '', deadline: '', totalScore: 0 });
const currentHomework = ref({});
const homeworkList = ref([]);
const pagination = ref({ total: 0, pages: 1, pageSize: 10, pageNum: 1 });
const questionListForSelect = ref([]);
const questionKeyword = ref('');
const questionCourseId = ref('');
const questionType = ref('');
const questionPage = ref(1);
const questionTotalPages = ref(1);

const totalPages = computed(() => Math.ceil(pagination.value.total / pagination.value.pageSize) || 1);

const percentSum = computed(() => {
  const s = (smartForm.value.choicePercent || 0)
    + (smartForm.value.judgePercent || 0)
    + (smartForm.value.essayPercent || 0);
  return s;
});

const openSmartDialog = () => {
  smartDialogVisible.value = true;
};

// 一键配平：按当前三项比例分配，使总和精确等于 100%
const balancePercent = () => {
  const raw = [
    smartForm.value.choicePercent || 0,
    smartForm.value.judgePercent || 0,
    smartForm.value.essayPercent || 0
  ];
  const sum = raw.reduce((s, v) => s + v, 0);
  // 三项全为 0 时，默认全部给选择题
  if (sum === 0) {
    smartForm.value.choicePercent = 100;
    smartForm.value.judgePercent = 0;
    smartForm.value.essayPercent = 0;
    return;
  }
  // 最大余数法：先按比例取整，再把剩余名额按小数部分从大到小补 1
  const exact = raw.map(v => (v / sum) * 100);
  const floors = exact.map(Math.floor);
  let remaining = 100 - floors.reduce((s, v) => s + v, 0);
  const order = exact
    .map((v, i) => i)
    .sort((i, j) => (exact[j] - floors[j]) - (exact[i] - floors[i]));
  const result = [...floors];
  for (let k = 0; k < remaining; k++) {
    result[order[k % order.length]]++;
  }
  smartForm.value.choicePercent = result[0];
  smartForm.value.judgePercent = result[1];
  smartForm.value.essayPercent = result[2];
};

// 智能选题生成：连同作业表单必要信息一起发送
const generateSmartQuestions = async () => {
  // 先校验上一个表单的必要信息
  if (!formData.value.title) {
    alert('请先填写作业标题');
    return;
  }
  if (!formData.value.clazzId) {
    alert('请先填写班级ID');
    return;
  }
  if (!formData.value.courseId) {
    alert('请先填写课程ID');
    return;
  }
  if (!smartForm.value.totalScore || smartForm.value.totalScore <= 0) {
    alert('请填写总分');
    return;
  }
  if (!smartForm.value.questionCount || smartForm.value.questionCount <= 0) {
    alert('请填写总题数');
    return;
  }
  if (percentSum.value !== 100) {
    alert('题型占比之和必须等于 100%');
    return;
  }

  const payload = {
    // 作业表单必要信息
    title: formData.value.title,
    content: formData.value.content,
    clazzId: Number(formData.value.clazzId),
    courseId: Number(formData.value.courseId),
    deadline: formData.value.deadline,
    // 智能选题参数
    totalScore: smartForm.value.totalScore,
    questionCount: smartForm.value.questionCount,
    difficulty: smartForm.value.difficulty,
    typePercent: {
      选择题: smartForm.value.choicePercent,
      判断题: smartForm.value.judgePercent,
      简答题: smartForm.value.essayPercent
    }
  };

  smartGenerating.value = true;
  try {
    const response = await homeworkApi.smartPublish(payload);
    if (response.code === 1) {
      alert('智能发布成功');
      smartDialogVisible.value = false;
      dialogVisible.value = false;
      questionStore.clearSelection();
      loadHomeworkList();
    } else {
      alert(response.msg || '智能发布失败');
    }
  } catch (error) {
    console.error('智能发布失败:', error);
    alert('网络错误，请重试');
  } finally {
    smartGenerating.value = false;
  }
};

const selectedStats = computed(() => questionStore.selectedStats);
const totalScore = computed(() => questionStore.totalScore);

const isSelected = (id) => questionStore.isSelected(id);
const getQuestionScore = (id) => questionStore.getScore(id);
const toggleQuestion = (q) => { questionStore.toggleQuestion(q); };
const updateQuestionScore = (id, event) => { questionStore.updateScore(id, parseInt(event.target.value) || 0); };

const getPieChartDashArray = (hw) => {
  const total = hw.totalStudent || 0;
  const submitted = hw.submitCount || 0;
  if (total === 0) return '0 101';
  const circumference = 2 * Math.PI * 16;
  const percent = submitted / total;
  const filled = circumference * percent;
  return `${filled} ${circumference}`;
};

const isExpired = (deadline) => {
  if (!deadline) return true;
  const deadlineDate = new Date(deadline);
  return deadlineDate < new Date();
};

const getCountdown = (deadline) => {
  if (!deadline) return '已截止';
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  
  if (deadlineDate <= now) {
    return '已截止';
  }
  
  const diff = deadlineDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (days > 0) {
    return `${days}天 ${hours}时 ${minutes}分`;
  } else if (hours > 0) {
    return `${hours}时 ${minutes}分 ${seconds}秒`;
  } else if (minutes > 0) {
    return `${minutes}分 ${seconds}秒`;
  } else {
    return `${seconds}秒`;
  }
};

const loadHomeworkList = async () => {
  try {
    const params = { ...searchForm.value, pageNum: pagination.value.pageNum, pageSize: pagination.value.pageSize };
    const response = await homeworkApi.getHomeworkList(params);
    if (response.code === 1) { homeworkList.value = response.data || []; if (response.map) { pagination.value.total = response.map.total || 0; pagination.value.pages = response.map.pages || 1; pagination.value.pageSize = response.map.pageSize || 10; pagination.value.pageNum = response.map.pageNum || 1; } }
    else { alert('获取作业列表失败'); }
  } catch (error) { console.error('获取作业列表错误:', error); alert('网络错误'); }
};

const loadQuestionsForSelection = async () => {
  try {
    const params = { pageNum: questionPage.value, pageSize: 5 };
    if (questionKeyword.value) params.keyword = questionKeyword.value;
    if (questionCourseId.value) params.courseId = parseInt(questionCourseId.value);
    if (questionType.value) params.type = questionType.value;
    const response = await questionApi.getQuestionList(params);
    if (response.code === 1) { 
      questionListForSelect.value = response.data || []; 
      if (response.map) { 
        questionTotalPages.value = response.map.pages || 1; 
        if (questionPage.value > questionTotalPages.value) {
          questionPage.value = 1;
          loadQuestionsForSelection();
          return;
        }
      } 
    }
  } catch (error) { console.error('获取题目列表错误:', error); }
};

const resetQuestionFilter = () => {
  questionKeyword.value = '';
  questionCourseId.value = '';
  questionType.value = '';
  questionPage.value = 1;
  loadQuestionsForSelection();
};

const deleteHomework = async (id) => {
  if (!confirm('确定要删除该作业吗？此操作不可撤销。')) {
    return;
  }
  try {
    const response = await homeworkApi.deleteHomework(id);
    if (response.code === 1) {
      alert('删除成功');
      loadHomeworkList();
    } else {
      alert(response.msg || '删除失败');
    }
  } catch (error) {
    console.error('删除作业错误:', error);
    alert('网络错误');
  }
};

const handleSearch = () => { pagination.value.pageNum = 1; loadHomeworkList(); };
const resetSearch = () => { searchForm.value = { clazzId: '', courseId: '' }; pagination.value.pageNum = 1; loadHomeworkList(); };
const handleCurrentChange = (current) => { pagination.value.pageNum = current; loadHomeworkList(); };
const handleSizeChange = () => { pagination.value.pageNum = 1; loadHomeworkList(); };

const openAddDialog = () => { questionStore.clearSelection(); formData.value = { title: '', content: '', clazzId: '', courseId: '', deadline: '', totalScore: 0 }; dialogVisible.value = true; loadQuestionsForSelection(); };

const viewDetail = (id) => {
  router.push(`/teacher/detail/${id}`);
};

const viewQuestions = (id) => {
  router.push(`/teacher/questions-view/${id}`);
};

const goToCorrection = (id) => {
  window.location.href = `/teacher/correction/${id}`;
};

const updateHomework = async () => {
  try {
    const updateData = {
      id: currentHomework.value.id,
      deadline: currentHomework.value.deadline,
      content: currentHomework.value.content
    };
    const response = await homeworkApi.updateHomework(updateData);
    if (response.code === 1) { 
      alert('修改成功'); 
      detailVisible.value = false; 
      loadHomeworkList(); 
    } else { 
      alert(response.msg || '修改失败'); 
    }
  } catch (error) { 
    console.error('修改作业错误:', error);
    alert('网络错误'); 
  }
};

const submitHomework = async () => {
  try {
    if (!formData.value.title || !formData.value.clazzId || !formData.value.courseId) { 
      alert('请填写完整信息'); 
      return; 
    }
    if (questionStore.allSelectedQuestions.length === 0) {
      alert('请至少选择一道题目');
      return;
    }
    const questionList = questionStore.allSelectedQuestions.map(q => {
      const score = questionStore.questionScores[q.id];
      if (score && score !== q.score) {
        return { questionId: q.id, score: score };
      }
      return { questionId: q.id };
    });
    const submitData = { 
      ...formData.value, 
      questionList: questionList,
      totalScore: questionStore.totalScore
    };
    const response = await homeworkApi.addHomework(submitData);
    if (response.code === 1) { 
      alert('添加作业成功'); 
      dialogVisible.value = false; 
      questionStore.clearSelection(); 
      loadHomeworkList(); 
    } else { 
      alert(response.msg || '添加作业失败'); 
    }
  } catch (error) { 
    console.error('添加作业错误:', error);
    alert('网络错误'); 
  }
};

onMounted(() => { loadHomeworkList(); });
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
.filter-input, .filter-select { padding: 10px 14px; border: 2px solid #eee; border-radius: 10px; font-size: 0.9rem; background-color: #fff; transition: all 0.3s ease; min-width: 120px; }
.filter-input:focus, .filter-select:focus { outline: none; border-color: #50C9C3; }
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.btn-primary { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }
.btn-secondary { background-color: #f0f0f0; color: #666; }
.btn-secondary:hover { background-color: #e0e0e0; }
.btn-add { background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3); }
.btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(80, 201, 195, 0.4); }
.btn-small { padding: 6px 12px; font-size: 0.85rem; background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; }
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

.pie-chart-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pie-chart {
  transform: rotate(-90deg);
}

.pie-label {
  font-size: 0.85rem;
  color: #50C9C3;
  font-weight: 600;
  min-width: 36px;
}

.uncorrect-count {
  font-size: 1rem;
  font-weight: 600;
  color: #ff6b6b;
  margin-right: 8px;
}

.action-btn.correct.small {
  padding: 4px 10px;
  font-size: 0.75rem;
  margin-left: 0;
}

.action-btn.correct.disabled {
  background-color: #e0e0e0;
  color: #999;
  cursor: not-allowed;
}

.action-btn.correct.disabled:hover {
  background-color: #e0e0e0;
  color: #999;
}
.data-table tr:hover { background-color: #f8fafc; }
.title-cell, .content-cell { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.deadline-cell { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.deadline-time { font-size: 0.85rem; color: #666; }
.countdown { font-size: 0.75rem; font-weight: 600; color: #50C9C3; padding: 2px 8px; background-color: #f0fdf9; border-radius: 6px; }
.countdown.expired { color: #999; background-color: #f5f5f5; }
.action-btn { padding: 6px 14px; border: none; border-radius: 8px; font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease; }
.action-btn.view { background-color: #e4f0ff; color: #4a90e2; }
.action-btn.view:hover { background-color: #4a90e2; color: white; }
.action-btn.edit { background-color: #e6f7f6; color: #2ba9a3; margin-left: 8px; }
.action-btn.edit:hover { background-color: #50C9C3; color: white; }
.action-btn.correct { background-color: #fff3cd; color: #856404; margin-left: 8px; }
.action-btn.correct:hover { background-color: #ffc107; color: white; }
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
.dialog-large { width: 75%; max-width: 1200px; max-height: 85vh; }
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
.question-selector { border: 2px solid #eee; border-radius: 12px; padding: 16px; }
.selector-header { display: flex; gap: 10px; margin-bottom: 12px; }
.filter-input-small, .filter-select-small { padding: 8px 12px; border: 2px solid #eee; border-radius: 8px; font-size: 0.85rem; background-color: #fff; }
.question-stats { display: flex; justify-content: space-between; padding: 10px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 12px; font-size: 0.85rem; color: #666; }
.total-score { color: #50C9C3; font-weight: 600; }
.question-list { max-height: 200px; overflow-y: auto; margin-bottom: 12px; }
.question-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f0f0f0; }
.question-item:last-child { border-bottom: none; }
.question-info { display: flex; align-items: center; gap: 10px; flex: 1; }
.question-title { flex: 1; font-size: 0.9rem; }
.question-type { font-size: 0.8rem; color: #4a90e2; background-color: #e4f0ff; padding: 2px 8px; border-radius: 4px; }
.question-score { font-size: 0.85rem; color: #999; }
.score-input { width: 80px; }
.score-input-field { width: 100%; padding: 6px 10px; border: 2px solid #eee; border-radius: 6px; font-size: 0.85rem; }
.score-input-field:focus { outline: none; border-color: #50C9C3; }
.pagination-small { display: flex; justify-content: center; align-items: center; gap: 12px; }
.page-btn-small { padding: 6px 12px; border: 2px solid #eee; border-radius: 6px; background-color: #fff; font-size: 0.8rem; cursor: pointer; }
.page-btn-small:hover:not(:disabled) { border-color: #50C9C3; color: #50C9C3; }
.page-btn-small:disabled { opacity: 0.5; cursor: not-allowed; }
.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 0.95rem;
  color: #333;
}

.detail-label {
  flex: 0 0 110px;
  text-align: right;
  font-weight: 600;
  color: #666;
  padding-right: 16px;
  white-space: nowrap;
}

.detail-content {
  flex: 1;
  text-align: left;
  color: #333;
  line-height: 1.5;
}

.detail-item-textarea,
.detail-item-input {
  display: flex;
  align-items: flex-start;
}

.detail-item-textarea .detail-label,
.detail-item-input .detail-label {
  padding-top: 10px;
}

.detail-item-textarea .form-textarea,
.detail-item-input .form-input {
  flex: 1;
  margin-top: 0;
}

/* 智能选题相关 */
.dialog-footer-between {
  justify-content: space-between;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.btn-smart {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.3);
}

.btn-smart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(80, 201, 195, 0.45);
}

.btn-loading {
  pointer-events: none;
  opacity: 0.8;
}

.smart-overlay {
  z-index: 1100;
}

.dialog-smart {
  width: 520px;
}

.smart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-suffix {
  position: relative;
}

.input-suffix .form-input {
  width: 100%;
  padding-right: 40px;
}

.suffix-text {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 0.85rem;
  pointer-events: none;
}

.difficulty-options {
  display: flex;
  gap: 10px;
}

.difficulty-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #eee;
  border-radius: 10px;
  background-color: #fff;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-btn:hover {
  border-color: #a5e3e0;
}

.difficulty-btn.active {
  border-color: #50C9C3;
  background-color: #e8f7f6;
  color: #2ba9a3;
  font-weight: 600;
}

.percent-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.percent-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.percent-label {
  flex: 0 0 60px;
  font-size: 0.9rem;
  color: #333;
}

.percent-input-wrap {
  flex: 1;
}

.percent-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}

.percent-sum {
  flex: 1;
  padding: 8px 12px;
  background-color: #f0fdf4;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #16a34a;
  text-align: left;
}

.percent-sum.invalid {
  background-color: #fef2f2;
  color: #e53935;
}

/* 描边按钮：与标准 btn 同高，青绿色与主题统一 */
.btn-outline {
  flex-shrink: 0;
  background-color: #fff;
  color: #50C9C3;
  border: 2px solid #50C9C3;
  padding: 8px 16px;
}

.btn-outline:hover {
  background-color: #e8f7f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(80, 201, 195, 0.25);
}
</style>