<template>
  <div class="ai-chat">
    <!-- 悬浮气泡按钮 -->
    <button class="ai-fab" :class="{ hidden: open }" @click="open = true" title="AI 助手">
      <span class="fab-icon"><el-icon><Service /></el-icon></span>
    </button>

    <!-- 聊天窗口 -->
    <transition name="chat-pop">
      <div v-if="open" class="chat-panel">
        <div class="chat-head">
          <span class="chat-title">AI 助手</span>
          <button class="chat-close" @click="open = false">✕</button>
        </div>

        <div ref="bodyRef" class="chat-body">
          <div
            v-for="(m, i) in messages"
            :key="i"
            class="msg-row"
            :class="m.role"
          >
            <div class="bubble">{{ m.content }}</div>
          </div>
          <div v-if="sending" class="msg-row ai">
            <div class="bubble thinking">思考中…</div>
          </div>
        </div>

        <div class="chat-input">
          <input
            v-model="draft"
            placeholder="说点什么…"
            :disabled="sending"
            @keyup.enter="handleSend"
          />
          <button :disabled="sending" @click="handleSend">发送</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { sendChat } from '@/api/ai'

const open = ref(false)
const draft = ref('')
const sending = ref(false)
// 开场白
const messages = ref([
  { role: 'ai', content: '你好！我是这个博客的 AI 助手，有什么想问的吗？' }
])
const bodyRef = ref(null)

function scrollToBottom() {
  nextTick(() => {
    if (bodyRef.value) {
      bodyRef.value.scrollTop = bodyRef.value.scrollHeight
    }
  })
}

async function handleSend() {
  const text = draft.value.trim()
  if (!text || sending.value) return
  // 先把用户消息放进列表
  messages.value.push({ role: 'user', content: text })
  draft.value = ''
  scrollToBottom()

  sending.value = true
  try {
    const reply = await sendChat(text)
    messages.value.push({ role: 'ai', content: reply })
  } catch (e) {
    messages.value.push({ role: 'ai', content: '抱歉，服务暂时还在开发中！有事请留言喔~' })
  } finally {
    sending.value = false
    scrollToBottom()
  }
}
</script>

<style scoped>
.ai-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
}

/* 悬浮按钮 */
.ai-fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: var(--gradient-primary);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  transition: transform var(--dur-base) var(--ease-soft), opacity var(--dur-base) ease;
}
.ai-fab:hover { transform: scale(1.06); }
.ai-fab.hidden { opacity: 0; pointer-events: none; }
.fab-icon { font-size: 24px; }

/* 聊天面板 */
.chat-panel {
  width: 340px;
  height: 460px;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md, 12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-head {
  height: 48px;
  background: var(--gradient-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-md);
  border-bottom: 1px solid var(--color-border-light);
}
.chat-title { font-weight: 500; color: var(--color-text-primary); }
.chat-close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 16px;
}

.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: var(--color-bg-page);
}
.msg-row { display: flex; }
.msg-row.user { justify-content: flex-end; }
.msg-row.ai { justify-content: flex-start; }
.bubble {
  max-width: 78%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: var(--font-body);
  line-height: 1.6;
  word-break: break-word;
}
.msg-row.user .bubble {
  background: var(--color-primary-light);
  color: var(--color-primary-active);
}
.msg-row.ai .bubble {
  background: #fff;
  border: 1px solid var(--color-border-light);
  color: var(--color-text-regular);
}
.bubble.thinking { color: var(--color-text-secondary); font-style: italic; }

.chat-input {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg);
}
.chat-input input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  font-size: var(--font-body);
  outline: none;
}
.chat-input input:focus { border-color: var(--color-primary); }
.chat-input button {
  border: none;
  border-radius: var(--radius-sm);
  padding: 0 16px;
  cursor: pointer;
  background: var(--color-primary);
  color: #fff;
}
.chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }

/* 弹出动画 */
.chat-pop-enter-active, .chat-pop-leave-active {
  transition: opacity var(--dur-base) ease, transform var(--dur-base) var(--ease-soft);
}
.chat-pop-enter-from, .chat-pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 480px) {
  .chat-panel { width: calc(100vw - 32px); }
}
</style>
