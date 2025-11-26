/**
 * 일부 텍스트만 색칠하거나 스타일 지정하기
 * Styling specific parts of translated text
 */

import React from 'react';
import { createI18n } from '../src/utils/createI18n';

// 번역 데이터
const translations = {
  common: {
    en: {
      welcome: 'Hello {{name}}!',
      price: 'Total: ${{amount}}',
      status: '{{count}} items in your cart',
      highlight: 'This is {{important}} information',
      multi: '{{first}} and {{second}} are available',
    },
    ko: {
      welcome: '안녕하세요 {{name}}님!',
      price: '총 {{amount}}원',
      status: '장바구니에 {{count}}개 상품',
      highlight: '이것은 {{important}} 정보입니다',
      multi: '{{first}}와 {{second}}를 사용할 수 있습니다',
    },
  },
} as const;

const i18n = createI18n(translations);

// 예제 1: 단일 텍스트 색칠
export function Example1_SingleColor() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 1: 이름만 파란색으로</h3>
      {t(
        'welcome',
        { name: '홍길동' },
        { name: { color: 'blue' } }
      )}
    </div>
  );
}

// 예제 2: 여러 스타일 조합
export function Example2_MultipleStyles() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 2: 여러 스타일 조합</h3>
      {t(
        'welcome',
        { name: '홍길동' },
        {
          name: {
            color: 'red',
            fontWeight: 'bold',
            fontSize: '20px',
            textDecoration: 'underline',
          }
        }
      )}
    </div>
  );
}

// 예제 3: 금액 강조
export function Example3_PriceHighlight() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 3: 금액 강조</h3>
      {t(
        'price',
        { amount: '50,000' },
        {
          amount: {
            color: '#ff6b6b',
            fontWeight: 'bold',
            fontSize: '24px',
          }
        }
      )}
    </div>
  );
}

// 예제 4: 배지 스타일
export function Example4_BadgeStyle() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 4: 배지 스타일</h3>
      {t(
        'status',
        { count: '5' },
        {
          count: {
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: 'bold',
          }
        }
      )}
    </div>
  );
}

// 예제 5: 여러 변수에 각각 다른 스타일
export function Example5_MultipleVariables() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 5: 여러 변수에 각각 다른 스타일</h3>
      {t(
        'multi',
        { first: 'React', second: 'TypeScript' },
        {
          first: {
            color: '#61dafb',
            fontWeight: 'bold',
          },
          second: {
            color: '#3178c6',
            fontWeight: 'bold',
          },
        }
      )}
    </div>
  );
}

// 예제 6: 중요 정보 하이라이트
export function Example6_HighlightBox() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 6: 중요 정보 하이라이트</h3>
      {t(
        'highlight',
        { important: '매우 중요한' },
        {
          important: {
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            border: '1px solid #ffc107',
          }
        }
      )}
    </div>
  );
}

// 예제 7: 그라디언트 효과 (고급)
export function Example7_GradientText() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 7: 그라디언트 텍스트</h3>
      {t(
        'welcome',
        { name: 'Premium User' },
        {
          name: {
            background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: '20px',
          }
        }
      )}
    </div>
  );
}

// 예제 8: 애니메이션 효과
export function Example8_AnimatedText() {
  const { t } = i18n.useTranslation('common');

  return (
    <div>
      <h3>예제 8: 애니메이션 텍스트</h3>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      {t(
        'status',
        { count: 'NEW' },
        {
          count: {
            color: '#e91e63',
            fontWeight: 'bold',
            animation: 'pulse 2s infinite',
          }
        }
      )}
    </div>
  );
}

// 전체 데모
export function StyledTextDemo() {
  return (
    <i18n.I18nProvider
      languageManagerOptions={{
        defaultLanguage: 'ko',
        enableAutoDetection: false,
      }}
    >
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🎨 Styled Text Examples</h1>
        <p>번역된 텍스트의 일부분만 스타일 지정하기</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Example1_SingleColor />
          <Example2_MultipleStyles />
          <Example3_PriceHighlight />
          <Example4_BadgeStyle />
          <Example5_MultipleVariables />
          <Example6_HighlightBox />
          <Example7_GradientText />
          <Example8_AnimatedText />
        </div>

        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>💡 사용 방법</h3>
          <pre style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
{`// 기본 사용법
t('welcome', { name: '홍길동' }, { name: { color: 'blue' } })

// 여러 스타일 조합
t('welcome',
  { name: '홍길동' },
  {
    name: {
      color: 'red',
      fontWeight: 'bold',
      fontSize: '20px'
    }
  }
)

// 여러 변수에 각각 다른 스타일
t('multi',
  { first: 'React', second: 'TypeScript' },
  {
    first: { color: '#61dafb', fontWeight: 'bold' },
    second: { color: '#3178c6', fontWeight: 'bold' }
  }
)`}
          </pre>
        </div>
      </div>
    </i18n.I18nProvider>
  );
}

export default StyledTextDemo;
