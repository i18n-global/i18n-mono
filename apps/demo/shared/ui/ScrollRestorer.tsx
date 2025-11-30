"use client";

import { useEffect } from "react";

/**
 * 언어 변경 후 페이지 새로고침 시 스크롤 위치를 복원하는 컴포넌트
 */
export default function ScrollRestorer() {
  useEffect(() => {
    // sessionStorage에서 스크롤 위치 복원
    const savedPosition = sessionStorage.getItem("i18n-scroll-position");
    if (savedPosition) {
      try {
        const { x, y } = JSON.parse(savedPosition);
        // 페이지가 완전히 로드된 후 스크롤 위치 복원
        window.scrollTo(x, y);
        // 복원 후 저장된 위치 제거
        sessionStorage.removeItem("i18n-scroll-position");
      } catch (error) {
        console.error("Failed to restore scroll position:", error);
      }
    }
  }, []);

  return null;
}
