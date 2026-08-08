import { http } from './request';
import type { Message } from '../types';

export interface MessageDTO {
  nickname: string;
  email?: string;
  content: string;
}

/** 留言列表 GET /api/messages（仅已审核，非分页） */
export function getMessages() {
  return http.get<Message[]>('/messages');
}

/** 提交留言 POST /api/messages（提交后待审核） */
export function submitMessage(data: MessageDTO) {
  return http.post<void>('/messages', data);
}
