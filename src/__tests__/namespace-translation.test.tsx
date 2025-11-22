/**
 * Comprehensive test suite for namespace-based translations
 * Tests useTranslation with namespace parameter and useDynamicTranslation
 */

import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { I18nProvider } from '../components/I18nProvider';
import { useTranslation, useDynamicTranslation } from '../hooks/useTranslation';
import type { NamespaceTranslations } from '../components/I18nProvider';

// Clean up after each test
afterEach(() => {
  cleanup();
  // Clear all cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  // Clear localStorage
  localStorage.clear();
});

// Test data
const namespaceTranslations: NamespaceTranslations = {
  common: {
    en: {
      welcome: 'Welcome',
      goodbye: 'Goodbye',
      greeting: 'Hello {{name}}',
      count: 'You have {{count}} items',
    },
    ko: {
      welcome: '환영합니다',
      goodbye: '안녕히 가세요',
      greeting: '안녕하세요 {{name}}',
      count: '{{count}}개의 아이템이 있습니다',
    },
  },
  menu: {
    en: {
      home: 'Home',
      about: 'About',
      settings: 'Settings',
    },
    ko: {
      home: '홈',
      about: '소개',
      settings: '설정',
    },
  },
  error: {
    en: {
      notfound: '404 - Page Not Found',
      servererror: '500 - Server Error',
      unauthorized: '401 - Unauthorized',
    },
    ko: {
      notfound: '404 - 페이지를 찾을 수 없습니다',
      servererror: '500 - 서버 오류',
      unauthorized: '401 - 인증되지 않음',
    },
  },
};

const dynamicTranslations = {
  en: {
    'item.type.0': 'League',
    'item.type.1': 'Cup',
    'item.type.2': 'Group',
    'error.404': 'Not Found',
    'error.500': 'Internal Server Error',
    'dynamic.key.{{id}}': 'Dynamic ID: {{id}}',
  },
  ko: {
    'item.type.0': '리그',
    'item.type.1': '컵',
    'item.type.2': '그룹',
    'error.404': '찾을 수 없음',
    'error.500': '내부 서버 오류',
    'dynamic.key.{{id}}': '동적 ID: {{id}}',
  },
};

describe('Namespace-based useTranslation', () => {
  describe('Basic Translation', () => {
    it('should translate from correct namespace', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return <div data-testid="translation">{t('welcome')}</div>;
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('Welcome');
    });

    it('should translate to English', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return <div data-testid="translation">{t('welcome')}</div>;
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('Welcome');
    });

    it('should translate to Korean', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return <div data-testid="translation">{t('welcome')}</div>;
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{
            defaultLanguage: 'ko',
            enableAutoDetection: false,
            enableLocalStorage: false,
          }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('환영합니다');
    });

    it('should handle different namespaces independently', () => {
      function TestComponent() {
        const { t: tCommon } = useTranslation('common');
        const { t: tMenu } = useTranslation('menu');
        const { t: tError } = useTranslation('error');

        return (
          <div>
            <div data-testid="common">{tCommon('welcome')}</div>
            <div data-testid="menu">{tMenu('home')}</div>
            <div data-testid="error">{tError('notfound')}</div>
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('common')).toHaveTextContent('Welcome');
      expect(screen.getByTestId('menu')).toHaveTextContent('Home');
      expect(screen.getByTestId('error')).toHaveTextContent('404 - Page Not Found');
    });
  });

  describe('Variable Interpolation', () => {
    it('should interpolate single variable', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return (
          <div data-testid="translation">
            {t('greeting', { name: 'John' })}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('Hello John');
    });

    it('should interpolate multiple variables', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return (
          <div data-testid="translation">
            {t('count', { count: 5 })}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('You have 5 items');
    });

    it('should handle missing variables gracefully', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return (
          <div data-testid="translation">
            {t('greeting', {})}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      // Should keep placeholder when variable is missing
      expect(screen.getByTestId('translation')).toHaveTextContent('Hello {{name}}');
    });

    it('should handle number variables', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return (
          <div data-testid="translation">
            {t('count', { count: 42 })}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('You have 42 items');
    });
  });

  describe('Styled Variables', () => {
    it('should render styled variables as React elements', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return (
          <div data-testid="translation">
            {t(
              'greeting',
              { name: 'Styled' },
              { name: { color: 'blue', fontWeight: 'bold' } }
            )}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      const container = screen.getByTestId('translation');
      expect(container.textContent).toContain('Hello');
      expect(container.textContent).toContain('Styled');

      const styledSpan = container.querySelector('span');
      expect(styledSpan).toBeInTheDocument();
      expect(styledSpan).toHaveStyle({ color: 'blue', fontWeight: 'bold' });
      expect(styledSpan).toHaveTextContent('Styled');
    });

    it('should handle multiple styled variables', () => {
      const testTranslations: NamespaceTranslations = {
        test: {
          en: {
            multi: '{{first}} and {{second}}',
          },
          ko: {
            multi: '{{first}}과 {{second}}',
          },
        },
      };

      function TestComponent() {
        const { t } = useTranslation('test');
        return (
          <div data-testid="translation">
            {t(
              'multi',
              { first: 'Red', second: 'Blue' },
              {
                first: { color: 'red' },
                second: { color: 'blue' },
              }
            )}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={testTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      const container = screen.getByTestId('translation');
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(2);
      expect(spans[0]).toHaveStyle({ color: 'red' });
      expect(spans[1]).toHaveStyle({ color: 'blue' });
    });
  });

  describe('Error Handling', () => {
    it('should warn and return key when namespace not found', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      function TestComponent() {
        const { t } = useTranslation('nonexistent');
        return <div data-testid="translation">{t('welcome')}</div>;
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('welcome');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Namespace "nonexistent" not found in translations'
      );

      consoleWarnSpy.mockRestore();
    });

    it('should return key when translation not found', () => {
      function TestComponent() {
        const { t } = useTranslation('common');
        return <div data-testid="translation">{t('nonexistent' as any)}</div>;
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('nonexistent');
    });

    it('should handle empty namespace gracefully', () => {
      const emptyNamespaceTranslations: NamespaceTranslations = {
        empty: {
          en: {},
          ko: {},
        },
      };

      function TestComponent() {
        const { t } = useTranslation('empty');
        return <div data-testid="translation">{t('anykey' as any)}</div>;
      }

      render(
        <I18nProvider
          translations={emptyNamespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('anykey');
    });
  });
});

describe('useDynamicTranslation', () => {
  describe('Basic Functionality', () => {
    it('should translate dynamic keys', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">{t('item.type.0')}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('League');
    });

    it('should handle runtime concatenated keys', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        const errorCode = 404;

        return (
          <div data-testid="translation">{t(`error.${errorCode}`)}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('Not Found');
    });

    it('should work with array indices', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        const items = [
          { type: 0, label: 'item.type.0' },
          { type: 1, label: 'item.type.1' },
          { type: 2, label: 'item.type.2' },
        ];

        return (
          <div>
            {items.map((item, index) => (
              <div key={index} data-testid={`item-${index}`}>
                {t(item.label)}
              </div>
            ))}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('item-0')).toHaveTextContent('League');
      expect(screen.getByTestId('item-1')).toHaveTextContent('Cup');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Group');
    });

    it('should translate to English', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">{t('item.type.0')}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('League');
    });

    it('should translate to Korean', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">{t('item.type.0')}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{
            defaultLanguage: 'ko',
            enableAutoDetection: false,
            enableLocalStorage: false,
          }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('리그');
    });
  });

  describe('Variable Interpolation', () => {
    it('should interpolate variables in dynamic translations', () => {
      const dynamicWithVars = {
        en: {
          'user.greeting': 'Welcome, {{username}}!',
          'item.count': 'You have {{count}} items',
        },
        ko: {
          'user.greeting': '환영합니다, {{username}}님!',
          'item.count': '{{count}}개의 아이템',
        },
      };

      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div>
            <div data-testid="greeting">
              {t('user.greeting', { username: 'John' })}
            </div>
            <div data-testid="count">
              {t('item.count', { count: 5 })}
            </div>
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicWithVars}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('greeting')).toHaveTextContent('Welcome, John!');
      expect(screen.getByTestId('count')).toHaveTextContent('You have 5 items');
    });

    it('should handle styled variables in dynamic translations', () => {
      const dynamicWithVars = {
        en: {
          'styled.text': 'Hello {{name}}',
        },
        ko: {
          'styled.text': '안녕하세요 {{name}}',
        },
      };

      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">
            {t(
              'styled.text',
              { name: 'World' },
              { name: { color: 'green' } }
            )}
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicWithVars}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      const container = screen.getByTestId('translation');
      expect(container.textContent).toContain('Hello');
      expect(container.textContent).toContain('World');

      const span = container.querySelector('span');
      expect(span).toHaveStyle({ color: 'green' });
    });
  });

  describe('Edge Cases', () => {
    it('should return key when dynamic translation not found', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">{t('nonexistent.key')}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={dynamicTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('nonexistent.key');
    });

    it('should work without dynamic translations provided', () => {
      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div data-testid="translation">{t('anykey')}</div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('translation')).toHaveTextContent('anykey');
    });

    it('should handle special characters in dynamic keys', () => {
      const specialDynamic = {
        en: {
          'key-with-dash': 'Dash Value',
          'key.with.many.dots': 'Dots Value',
          'key_with_underscore': 'Underscore Value',
        },
        ko: {
          'key-with-dash': '대시 값',
          'key.with.many.dots': '점 값',
          'key_with_underscore': '언더스코어 값',
        },
      };

      function TestComponent() {
        const { t } = useDynamicTranslation();
        return (
          <div>
            <div data-testid="dash">{t('key-with-dash')}</div>
            <div data-testid="dots">{t('key.with.many.dots')}</div>
            <div data-testid="underscore">{t('key_with_underscore')}</div>
          </div>
        );
      }

      render(
        <I18nProvider
          translations={namespaceTranslations}
          dynamicTranslations={specialDynamic}
          languageManagerOptions={{ defaultLanguage: 'en' }}
        >
          <TestComponent />
        </I18nProvider>
      );

      expect(screen.getByTestId('dash')).toHaveTextContent('Dash Value');
      expect(screen.getByTestId('dots')).toHaveTextContent('Dots Value');
      expect(screen.getByTestId('underscore')).toHaveTextContent('Underscore Value');
    });
  });
});

describe('Mixed Usage: Namespace + Dynamic', () => {
  it('should use both namespace and dynamic translations together', () => {
    function TestComponent() {
      const { t: tCommon } = useTranslation('common');
      const { t: tDynamic } = useDynamicTranslation();

      return (
        <div>
          <div data-testid="namespace">{tCommon('welcome')}</div>
          <div data-testid="dynamic">{tDynamic('item.type.0')}</div>
        </div>
      );
    }

    render(
      <I18nProvider
        translations={namespaceTranslations}
        dynamicTranslations={dynamicTranslations}
        languageManagerOptions={{ defaultLanguage: 'en' }}
      >
        <TestComponent />
      </I18nProvider>
    );

    expect(screen.getByTestId('namespace')).toHaveTextContent('Welcome');
    expect(screen.getByTestId('dynamic')).toHaveTextContent('League');
  });

  it('should keep namespace and dynamic translations independent', () => {
    function TestComponent() {
      const { t: tCommon } = useTranslation('common');
      const { t: tDynamic } = useDynamicTranslation();

      return (
        <div>
          {/* "item.type.0" is only in dynamic, not in common namespace */}
          <div data-testid="namespace-try-dynamic">
            {tCommon('item.type.0' as any)}
          </div>
          {/* "welcome" is only in common namespace, not in dynamic */}
          <div data-testid="dynamic-try-namespace">
            {tDynamic('welcome')}
          </div>
        </div>
      );
    }

    render(
      <I18nProvider
        translations={namespaceTranslations}
        dynamicTranslations={dynamicTranslations}
        languageManagerOptions={{ defaultLanguage: 'en' }}
      >
        <TestComponent />
      </I18nProvider>
    );

    // Should return keys when not found
    expect(screen.getByTestId('namespace-try-dynamic')).toHaveTextContent('item.type.0');
    expect(screen.getByTestId('dynamic-try-namespace')).toHaveTextContent('welcome');
  });
});
