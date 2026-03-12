/**
 * Claude API wrapper
 *
 * 주요 용도:
 *   - 사용자 입력 텍스트 → Markdown 변환 (/api/ai/markdown)
 *
 * 규칙:
 *   - AI 호출은 debounce 2000ms + 저장 시에만 최종 변환
 *   - ANTHROPIC_API_KEY는 서버 사이드 전용
 */

import Anthropic from '@anthropic-ai/sdk';

// 서버 사이드 전용 (API routes에서만 import)
let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return _client;
}

/**
 * 자유 텍스트를 구조화된 Markdown으로 변환
 */
export async function convertToMarkdown(rawText: string): Promise<string> {
  const client = getClient();

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `다음 텍스트를 읽기 좋은 Markdown 형식으로 변환해줘.
원본의 의미와 내용을 그대로 유지하되, 헤딩/목록/단락 구조를 자연스럽게 정리해줘.
코드 블록이나 특수 형식은 원본에 있는 경우만 사용해.
Markdown 코드 블록(\`\`\`md)으로 감싸지 말고 바로 Markdown 텍스트만 반환해.

텍스트:
${rawText}`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');
  return content.text;
}
