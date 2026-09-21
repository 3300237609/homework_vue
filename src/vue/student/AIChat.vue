<template>
  <div class="chat-container">
    <div class="chat-header">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        返回
      </button>
      <h2 class="chat-title">AI 解答助手</h2>
    </div>

    <div class="question-context" v-if="questionData">
      <div class="context-header">
        <span class="context-label">当前题目</span>
        <span class="context-type">{{ questionData.questionType }}</span>
      </div>
      <div class="context-content">
        <p class="context-title">{{ questionData.questionTitle }}</p>
        <div class="context-options" v-if="questionData.questionOptions">
          <div 
            v-for="(value, key) in parseOptions(questionData.questionOptions)" 
            :key="key"
            :class="['context-option', { 
              correct: questionData.correctAnswer === key,
              wrong: questionData.studentAnswer === key && questionData.correctAnswer !== key
            }]"
          >
            <span class="option-key">{{ key }}</span>
            <span class="option-value">{{ value }}</span>
            <span v-if="questionData.correctAnswer === key" class="correct-tag">正确答案</span>
            <span v-if="questionData.studentAnswer === key && questionData.correctAnswer !== key" class="wrong-tag">你的答案</span>
          </div>
        </div>
        <div class="context-score">
          <span>得分：{{ questionData.score }} / {{ questionData.fullScore }}</span>
        </div>
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-avatar">
          <svg v-if="message.role === 'user'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
          </svg>
        </div>
        <div class="message-content">
          <div class="message-text" v-html="message.content"></div>
          <div class="typing-indicator" v-if="message.role === 'assistant' && message.typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-area">
      <textarea 
        v-model="inputMessage" 
        @keydown.enter.exact.prevent="sendMessage"
        placeholder="输入你的问题..."
        class="chat-input"
        :disabled="isLoading"
      ></textarea>
      <button 
        class="send-btn" 
        @click="sendMessage"
        :disabled="isLoading || !inputMessage.trim()"
      >
        <svg v-if="!isLoading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span v-else class="loading-spinner"></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const questionData = ref(null);
const messages = ref([]);
const inputMessage = ref('');
const isLoading = ref(false);
const messagesContainer = ref(null);

const goBack = () => {
  router.back();
};

const parseOptions = (optionsStr) => {
  if (!optionsStr) return {};
  try {
    return JSON.parse(optionsStr);
  } catch {
    return {};
  }
};

const escapeHtml = (text) => {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const formatMessageForStreaming = (content) => {
  if (!content) return '';
  
  let html = content;
  
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  
  html = html.replace(/\n{3,}/g, '\n\n');
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, ' ');
  
  return html;
};

const formatMessage = (content) => {
  if (!content) return '';
  
  let html = content;
  
  html = html.replace(/<br\s*\/?><br\s*\/?>/gi, '\n\n');
  html = html.replace(/<br\s*\/?>/gi, '\n');
  
  html = html.replace(/\|(.+)\|[\r\n]+\|[-:\s|]+\|[\r\n]+((?:\|.+\|[\r\n]*)+)/gm, (match, headerRow, bodyRows) => {
    const headers = headerRow.split('|').filter(h => h.trim()).map(h => `<th>${escapeHtml(h.trim())}</th>`).join('');
    const rows = bodyRows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${escapeHtml(c.trim())}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<div class="table-wrapper"><table class="markdown-table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });
  
  html = html.replace(/^###\s+(.+?)\s*$/gim, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+?)\s*$/gim, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+?)\s*$/gim, '<h1>$1</h1>');
  
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>');
  
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  html = html.replace(/^\s*[-*+]\s+/gm, '<li>');
  html = html.replace(/(<li>[\s\S]*?)(?=\n\n|\n<li>|\Z)/g, '$1</li>');
  html = html.replace(/((?:<li>.*?<\/li>)+)/g, '<ul>$1</ul>');
  
  html = html.replace(/^\s*\d+\.\s+/gm, '<li>');
  html = html.replace(/(<li>[\s\S]*?)(?=\n\n|\n<li>|\Z)/g, '$1</li>');
  html = html.replace(/((?:<li>.*?<\/li>)+)/g, '<ol>$1</ol>');
  
  html = html.replace(/---/g, '<hr>');
  
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, ' ');
  
  return html;
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const buildChatHistory = () => {
  const history = messages.value
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content.replace(/<[^>]+>/g, '').trim()
    }));
  return history;
};

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;
  
  const userMessage = inputMessage.value.trim();
  inputMessage.value = '';
  
  messages.value.push({
    role: 'user',
    content: userMessage
  });
  scrollToBottom();
  
  isLoading.value = true;
  messages.value.push({
    role: 'assistant',
    content: '',
    typing: true
  });
  
  try {
    const requestBody = {
      question: buildPrompt(userMessage),
      chatHistory: buildChatHistory(),
      questionContext: questionData.value ? {
        title: questionData.value.title,
        type: questionData.value.type,
        options: questionData.value.options,
        correctAnswer: questionData.value.correctAnswer,
        studentAnswer: questionData.value.studentAnswer,
        score: questionData.value.score,
        fullScore: questionData.value.fullScore
      } : null
    };
    
    const response = await fetch('http://localhost:80/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
    let fullContent = '';
    let buffer = '';
    let lastMessage = messages.value[messages.value.length - 1];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (value) {
        try {
          buffer += decoder.decode(value, { stream: !done });
        } catch (e) {
          buffer += decoder.decode(value);
        }
      }
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        let content = trimmedLine;
        if (content.startsWith('data:')) {
          content = content.substring(5).trim();
        }
        
        fullContent += content + '\n';
        
        if (lastMessage.role === 'assistant') {
          lastMessage.content = formatMessageForStreaming(fullContent);
          lastMessage.typing = false;
          await nextTick();
          scrollToBottom();
        }
      }
      
      if (done) {
        break;
      }
    }
    
    if (buffer.trim()) {
      let content = buffer.trim();
      if (content.startsWith('data:')) {
        content = content.substring(5).trim();
      }
      fullContent += content;
    }
    
    if (lastMessage.role === 'assistant') {
      lastMessage.content = fullContent ? formatMessage(fullContent) : '抱歉，暂时无法回答这个问题。';
      lastMessage.typing = false;
      scrollToBottom();
    }
    
  } catch (error) {
    console.error('AI响应错误:', error);
    const lastMessage = messages.value[messages.value.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.content = '抱歉，AI服务暂时不可用，请稍后重试。';
      lastMessage.typing = false;
    }
  } finally {
    isLoading.value = false;
  }
};

const buildPrompt = (userQuestion) => {
  if (!questionData.value) {
    return userQuestion;
  }
  
  const q = questionData.value;
  let prompt = `【题目信息】\n`;
  prompt += `题型：${q.questionType}\n`;
  prompt += `题目：${q.questionTitle}\n`;
  
  if (q.questionOptions) {
    const options = parseOptions(q.questionOptions);
    prompt += `选项：\n`;
    for (const [key, value] of Object.entries(options)) {
      prompt += `${key}. ${value}\n`;
    }
  }
  
  if (q.correctAnswer) {
    prompt += `正确答案：${q.correctAnswer}\n`;
  }
  
  if (q.studentAnswer) {
    prompt += `学生答案：${q.studentAnswer}\n`;
  }
  
  prompt += `学生得分：${q.score}/${q.fullScore}\n\n`;
  prompt += `【用户问题】\n${userQuestion}`;
  
  return prompt;
};

const sendInitialMessage = () => {
  if (questionData.value) {
    inputMessage.value = `请帮我分析一下这道${questionData.value.questionType}题，我想了解一下解题思路和知识点。`;
    sendMessage();
  }
};

onMounted(() => {
  if (route.query.question) {
    try {
      questionData.value = JSON.parse(route.query.question);
    } catch (e) {
      console.error('解析题目数据失败:', e);
    }
  }
  
  setTimeout(() => {
    sendInitialMessage();
  }, 500);
});
</script>

<style scoped>
.chat-container {
  height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-title {
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.question-context {
  background: #fff;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.context-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.context-label {
  font-weight: 600;
  color: #333;
}

.context-type {
  background: #e6f7f6;
  color: #50C9C3;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.context-content {
  padding-left: 12px;
}

.context-title {
  font-size: 0.95rem;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.context-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.context-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid transparent;
}

.context-option.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}

.context-option.wrong {
  background: #ffebee;
  border-color: #f44336;
}

.option-key {
  font-weight: 600;
  color: #666;
  min-width: 36px;
  text-align: center;
  background: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

.option-value {
  flex: 1;
  color: #333;
  text-align: left;
}

.correct-tag, .wrong-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.correct-tag {
  background: #4caf50;
  color: #fff;
}

.wrong-tag {
  background: #f44336;
  color: #fff;
}

.context-score {
  color: #666;
  font-size: 0.9rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.assistant {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message.user .message-avatar {
  background: #50C9C3;
  color: #fff;
}

.message.assistant .message-avatar {
  background: #ff9800;
  color: #fff;
}

.message-content {
  flex: 1;
}

.message-text {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.7;
  font-size: 15px;
  text-align: left;
  word-wrap: break-word;
  word-break: normal;
  white-space: pre-line;
}

.message.user .message-text {
  background: #50C9C3;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-text {
  background: #fff;
  color: #333;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message-text code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.message-text strong {
  color: inherit;
  font-weight: 600;
}

.message-text em {
  font-style: italic;
}

.message-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 16px 0 8px 0;
  color: #1a1a2e;
}

.message-text h2 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px;
  color: #222;
  line-height: 1.5;
  white-space: nowrap;
  overflow: visible;
}

.message-text h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 16px 0 8px;
  line-height: 1.4;
}

.message-text ul {
  padding-left: 28px;
  margin: 10px 0;
  list-style-type: disc;
}

.message-text ol {
  padding-left: 28px;
  margin: 10px 0;
}

.message-text li {
  margin: 6px 0;
  line-height: 1.6;
}

.message-text ul li {
  list-style-type: disc;
}

.message-text ol li {
  list-style-type: decimal;
}

.message-text p {
  margin: 8px 0;
  line-height: 1.6;
}

.message-text .inline-code {
  background: #f0f4f8;
  color: #e53e3e;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9em;
}

.message-text .code-block {
  background: #1a1a2e;
  color: #e4e4e7;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 12px 0;
}

.message-text .code-block code {
  background: transparent;
  color: inherit;
  padding: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.message-text a {
  color: #50C9C3;
  text-decoration: none;
  border-bottom: 1px dashed #50C9C3;
}

.message-text a:hover {
  color: #45B8B2;
  border-bottom-style: solid;
}

.message-text hr {
  border: none;
  border-top: 2px dashed #ddd;
  margin: 16px 0;
}

.table-wrapper {
  overflow-x: auto;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.markdown-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  background: #fff;
}

.markdown-table thead {
  background: linear-gradient(135deg, #50C9C3 0%, #45B8B2 100%);
}

.markdown-table th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: #fff;
  border-bottom: 2px solid #45B8B2;
}

.markdown-table td {
  padding: 10px 14px;
  text-align: left;
  color: #333;
  border-bottom: 1px solid #eee;
}

.markdown-table tbody tr:nth-child(even) {
  background-color: #f8fafc;
}

.markdown-table tbody tr:hover {
  background-color: #f0fdf9;
}

.markdown-table tbody tr:last-child td {
  border-bottom: none;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  width: fit-content;
  margin-top: 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.chat-input-area {
  padding: 16px 24px;
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-shrink: 0;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 0.95rem;
  resize: none;
  min-height: 48px;
  max-height: 120px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #50C9C3;
  box-shadow: 0 0 0 3px rgba(80, 201, 195, 0.1);
}

.send-btn {
  width: 48px;
  height: 48px;
  background: #50C9C3;
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #45B8B2;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
