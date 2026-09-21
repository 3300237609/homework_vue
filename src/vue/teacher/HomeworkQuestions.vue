<template>
  <div class="questions-page">
    <div class="page-header-bar">
      <button class="back-btn" @click="goBack">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        返回
      </button>
      <h2 class="page-name">作业题目</h2>
    </div>

    <div v-if="loading" class="loading-box">加载中...</div>

    <template v-else>
      <div class="homework-info-card">
        <div class="info-title">{{ homeworkInfo.title }}</div>
        <div class="info-meta">
          <span>班级ID：{{ homeworkInfo.clazzId ?? '-' }}</span>
          <span>课程ID：{{ homeworkInfo.courseId ?? '-' }}</span>
          <span>截止时间：{{ formatTime(homeworkInfo.deadline) || '-' }}</span>
          <span>总分：{{ homeworkInfo.totalScore ?? '-' }}</span>
          <span>题目数：{{ questions.length }}</span>
        </div>
        <div class="info-content" v-if="homeworkInfo.content">作业内容：{{ homeworkInfo.content }}</div>
      </div>

      <div v-if="questions.length === 0" class="empty-box">该作业暂无题目</div>

      <div
        v-for="(q, index) in questions"
        :key="q.questionId ?? index"
        class="question-card"
      >
        <div class="question-head">
          <span class="q-num">第 {{ index + 1 }} 题</span>
          <span class="q-type" :class="typeClass(q.type)">{{ q.type }}</span>
          <span class="q-score">（{{ q.score }}分）</span>
        </div>
        <div class="q-title">{{ q.title }}</div>

        <div class="q-options" v-if="optionMap(q).length">
          <div
            v-for="opt in optionMap(q)"
            :key="opt.key"
            class="q-option"
            :class="{ correct: q.correctAnswer === opt.key }"
          >
            <span class="opt-key">{{ opt.key }}</span>
            <span class="opt-text">{{ opt.text }}</span>
            <span v-if="q.correctAnswer === opt.key" class="opt-mark">正确答案</span>
          </div>
        </div>

        <div class="q-answer" v-if="q.type === '简答' && q.correctAnswer">
          <span class="answer-label">参考答案：</span>
          <span class="answer-text">{{ q.correctAnswer }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { homeworkApi } from '../../api/api';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const homeworkInfo = ref({});
const questions = ref([]);

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const goBack = () => {
  router.push('/teacher/homework');
};

// ISO 时间 → 易读格式：2026-10-09 13:54
const formatTime = (t) => {
  if (!t) return '';
  return String(t).replace('T', ' ').slice(0, 16);
};

const stripPrefix = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/^\s*[A-Ja-j]\s*[.、．\)）:：]\s*/, '').trim();
};

// 把 options 统一转成 [{key, text}]
const optionMap = (q) => {
  if (!q.options) return [];
  let parsed = q.options;
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }
  const isJudge = q.type === '判断';
  if (Array.isArray(parsed)) {
    return parsed.map((item, i) => {
      let key;
      if (isJudge) {
        key = /正确|^T|对|√|是/i.test(String(item)) ? 'T' : 'F';
      } else {
        key = LETTERS[i];
      }
      return { key, text: stripPrefix(item) };
    });
  }
  return Object.keys(parsed).map(k => {
    let key = k;
    if (isJudge) {
      if (/true|正确|^t|对/i.test(k)) key = 'T';
      if (/false|错误|^f|错/i.test(k)) key = 'F';
    }
    return { key, text: stripPrefix(parsed[k]) };
  });
};

const typeClass = (type) => {
  if (type === '单选' || type === '多选') return 'type-choice';
  if (type === '判断') return 'type-judge';
  return 'type-essay';
};

const loadDetail = async () => {
  loading.value = true;
  try {
    const res = await homeworkApi.getHomeworkDetail(route.params.id);
    if (res.code === 1) {
      const data = res.data || {};
      homeworkInfo.value = data;
      // 兼容 questionList / questions / 直接数组
      const list = data.questionList || data.questions || (Array.isArray(data) ? data : []);
      questions.value = list.map(item => {
        // 实际结构：关联记录外层，题目内容嵌套在 question 字段内
        const q = item.question || item;
        return {
          questionId: q.id ?? item.questionId,
          title: q.title,
          type: q.questionType || q.type,
          options: q.options,
          // 正确答案字段为 answer
          correctAnswer: q.correctAnswer ?? q.answer,
          // 每题分值取关联记录上的 score，兜底取题目自身分值
          score: item.score ?? q.questionScore ?? q.fullScore ?? 0
        };
      });
    } else {
      alert(res.msg || '加载失败');
    }
  } catch (error) {
    console.error('加载作业题目失败:', error);
    alert('网络错误');
  } finally {
    loading.value = false;
  }
};

onMounted(loadDetail);
</script>

<style scoped>
.questions-page {
  padding: 0;
  text-align: left;
}

.page-header-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  margin: 0 0 20px;
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

/* 向上延伸覆盖滚动容器顶部 24px 内边距，消除吸顶后上方缝隙（宽度与内容区一致） */
.page-header-bar::before {
  content: '';
  position: absolute;
  top: -24px;
  left: 0;
  right: 0;
  height: 24px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: #f8fafc;
  border: none;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background-color: #e8f4f3;
  color: #50C9C3;
}

.page-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
}

.loading-box,
.empty-box {
  padding: 60px;
  text-align: center;
  color: #999;
  background: #fff;
  border-radius: 12px;
}

.homework-info-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.info-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.info-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.info-content {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

.question-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.question-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.q-num {
  font-weight: 600;
  color: #333;
}

.q-type {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.type-choice {
  background: #e6f7f6;
  color: #2ba9a3;
}

.type-judge {
  background: #e4f0ff;
  color: #4a90e2;
}

.type-essay {
  background: #fff3cd;
  color: #856404;
}

.q-score {
  color: #999;
  font-size: 0.9rem;
}

.q-title {
  color: #333;
  line-height: 1.7;
  margin-bottom: 16px;
}

.q-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.q-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fafafa;
  border: 2px solid transparent;
  border-radius: 10px;
}

.q-option.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.opt-key {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.85rem;
  color: #666;
}

.q-option.correct .opt-key {
  background: #4caf50;
  border-color: #4caf50;
  color: #fff;
}

.opt-text {
  flex: 1;
  color: #333;
  font-size: 0.95rem;
}

.opt-mark {
  font-size: 0.75rem;
  color: #4caf50;
  font-weight: 600;
}

.q-answer {
  margin-top: 8px;
  padding: 12px 16px;
  background: #f6ffed;
  border-left: 4px solid #52c41a;
  border-radius: 8px;
  line-height: 1.7;
}

.answer-label {
  color: #666;
  font-size: 0.9rem;
}

.answer-text {
  color: #333;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
