/**
 * Lip-Safe AI - 공통 데이터 포맷터 유틸리티 모듈
 * 퍼센트, 처리 속도 수치 포맷팅 및 날짜 계산 헬퍼 함수를 제공합니다.
 * (모든 주석 한글 작성)
 */

/**
 * 판독 정확도 퍼센트 수치를 소수점 첫째 자리 포맷 문자열로 변환합니다.
 * @param {number} value - 정확도 수치 (예: 99.2)
 * @returns {string} 포맷팅된 정확도 문자열 (예: "99.2%")
 */
export function formatAccuracy(value) {
  if (value === undefined || value === null) return '0.0%';
  const num = typeof value === 'number' ? value : parseFloat(value);
  return `${num.toFixed(1)}%`;
}

/**
 * 엣지AI 판독 연산 속도 수치를 초(sec) 단위 문자열로 변환합니다.
 * @param {number} seconds - 초 단위 연산 속도 (예: 0.3)
 * @returns {string} 포맷팅된 속도 문자열 (예: "0.3초")
 */
export function formatResponseTime(seconds) {
  if (seconds === undefined || seconds === null) return '0.0초';
  const num = typeof seconds === 'number' ? seconds : parseFloat(seconds);
  return `${num.toFixed(1)}초`;
}

/**
 * ISO 날짜 문자열을 한국어 표준 날짜 표기 형식으로 변환합니다.
 * @param {string|Date} dateInput - 날짜 객체 또는 문자열
 * @returns {string} 예: "2026년 08월 08일"
 */
export function formatDateKorean(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}
