import { defineStore } from 'pinia';

export const useQuestionStore = defineStore('question', {
  state: () => ({
    // 选中的题目ID集合
    selectedQuestionIds: new Set(),
    // 所有已选择的题目（全局）
    allSelectedQuestions: [],
    // 题目分值
    questionScores: {},
    // 题型统计
    typeStats: {
      单选: 0,
      多选: 0,
      判断: 0,
      简答: 0
    }
  }),
  
  getters: {
    // 计算总分
    totalScore: (state) => {
      let total = 0;
      state.allSelectedQuestions.forEach(question => {
        total += state.questionScores[question.id] || question.score || 5;
      });
      return total;
    },
    
    // 已选题目数量
    selectedCount: (state) => {
      return state.allSelectedQuestions.length;
    },
    
    // 选中题目统计（用于模板显示）
    selectedStats: (state) => {
      return {
        single: state.typeStats['单选'] || 0,
        multiple: state.typeStats['多选'] || 0,
        judge: state.typeStats['判断'] || 0,
        essay: state.typeStats['简答'] || 0
      };
    }
  },
  
  actions: {
    // 添加题目
    addQuestion(question) {
      this.selectedQuestionIds.add(question.id);
      if (!this.allSelectedQuestions.some(item => item.id === question.id)) {
        this.allSelectedQuestions.push(question);
      }
      this.updateTypeStats();
    },
    
    // 移除题目
    removeQuestion(questionId) {
      this.selectedQuestionIds.delete(questionId);
      this.allSelectedQuestions = this.allSelectedQuestions.filter(item => item.id !== questionId);
      this.updateTypeStats();
    },
    
    // 更新题目分值
    updateScore(questionId, score) {
      this.questionScores[questionId] = score;
    },
    
    // 批量添加题目
    addQuestions(questions) {
      questions.forEach(question => {
        this.addQuestion(question);
      });
    },
    
    // 批量移除题目
    removeQuestions(questionIds) {
      questionIds.forEach(id => {
        this.removeQuestion(id);
      });
    },
    
    // 更新题型统计
    updateTypeStats() {
      // 重置统计
      this.typeStats = {
        单选: 0,
        多选: 0,
        判断: 0,
        简答: 0
      };
      // 统计所有已选择的题目
      this.allSelectedQuestions.forEach(question => {
        if (this.typeStats[question.type] !== undefined) {
          this.typeStats[question.type]++;
        }
      });
    },
    
    // 清空所有选择
    clearSelection() {
      this.selectedQuestionIds = new Set();
      this.allSelectedQuestions = [];
      this.questionScores = {};
      this.typeStats = {
        单选: 0,
        多选: 0,
        判断: 0,
        简答: 0
      };
    },
    
    // 检查题目是否被选中
    isSelected(questionId) {
      return this.selectedQuestionIds.has(questionId);
    },
    
    // 获取题目分值
    getScore(questionId) {
      return this.questionScores[questionId];
    },
    
    // 切换题目选择状态
    toggleQuestion(question) {
      if (this.isSelected(question.id)) {
        this.removeQuestion(question.id);
      } else {
        this.addQuestion(question);
        // 设置默认分值
        if (!this.questionScores[question.id]) {
          this.questionScores[question.id] = question.score || 5;
        }
      }
    },
    
    // 从当前页面更新选择状态
    updateFromCurrentPage(currentPageQuestions, selectedQuestions) {
      // 获取当前页面所有题目ID
      const currentPageIds = new Set(currentPageQuestions.map(item => item.id));
      
      // 只处理当前页面的题目，不影响其他页面的已选择题目
      
      // 移除当前页面的未选中题目
      currentPageIds.forEach(id => {
        // 检查当前页面的题目是否在选中列表中
        const isSelected = selectedQuestions.some(question => question.id === id);
        if (!isSelected) {
          // 如果不在选中列表中，从全局选择中移除
          this.selectedQuestionIds.delete(id);
          this.allSelectedQuestions = this.allSelectedQuestions.filter(item => item.id !== id);
        }
      });
      
      // 添加当前页面的选中题目
      selectedQuestions.forEach(question => {
        this.addQuestion(question);
      });
    }
  }
});