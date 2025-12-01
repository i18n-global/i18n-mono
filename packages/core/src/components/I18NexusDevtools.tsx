"use client";

import React from "react";
import { useI18nContext } from "./I18nProvider";

export interface I18NexusDevtoolsProps {
  /** 개발 도구 기본 열림 상태 */
  initialIsOpen?: boolean;
  /** 개발 도구 패널 위치 (기본: 'bottom-left') */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** 패널 커스텀 스타일 */
  panelStyles?: React.CSSProperties;
  /** 버튼 커스텀 스타일 */
  buttonStyles?: React.CSSProperties;
}

export function I18NexusDevtools({
  initialIsOpen = false,
  position = "bottom-left",
  panelStyles = {},
  buttonStyles = {},
}: I18NexusDevtoolsProps) {
  const {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    languageManager,
    isLoading,
    namespaceTranslations,
  } = useI18nContext();

  const [isOpen, setIsOpen] = React.useState(initialIsOpen);
  const [isDragging, setIsDragging] = React.useState(false);
  const browserLanguage = languageManager.detectBrowserLanguage();

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const toggleOpen = () => setIsOpen(!isOpen);

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "fixed",
      zIndex: 99999,
    };

    switch (position) {
      case "top-left":
        return { ...baseStyles, top: 16, left: 16 };
      case "top-right":
        return { ...baseStyles, top: 16, right: 16 };
      case "bottom-right":
        return { ...baseStyles, bottom: 16, right: 16 };
      case "bottom-left":
      default:
        return { ...baseStyles, bottom: 16, left: 16 };
    }
  };

  const handleLanguageChange = async (lang: string) => {
    try {
      await changeLanguage(lang);
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  const resetToDefault = () => {
    languageManager.reset();
  };

  const resetToBrowser = () => {
    if (browserLanguage) {
      handleLanguageChange(browserLanguage);
    }
  };

  // 모든 네임스페이스의 번역 키 합산
  const getAllTranslations = () => {
    const allTranslations: Record<string, string> = {};
    Object.keys(namespaceTranslations).forEach((ns) => {
      const nsTranslations = namespaceTranslations[ns]?.[currentLanguage];
      if (nsTranslations) {
        Object.assign(allTranslations, nsTranslations);
      }
    });
    return allTranslations;
  };

  const currentTranslations = getAllTranslations();
  const translationCount = Object.keys(currentTranslations).length;

  return (
    <div style={getPositionStyles()}>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          style={{
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.2s",
            ...buttonStyles,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#4f46e5";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#6366f1";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }}
        >
          <span style={{ fontSize: "18px" }}>🌐</span>
          <span>i18nexus</span>
        </button>
      )}

      {isOpen && (
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            width: "400px",
            maxHeight: "600px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            ...panelStyles,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: isDragging ? "grabbing" : "grab",
            }}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>🌐</span>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                i18nexus Devtools
              </h3>
            </div>
            <button
              onClick={toggleOpen}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                color: "white",
                width: "24px",
                height: "24px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              }}
            >
              ✕
            </button>
          </div>

          <div
            style={{
              padding: "16px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Current Language
              </h4>
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: "18px", fontWeight: "600" }}>
                    {currentLanguage.toUpperCase()}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>
                    {availableLanguages.find((l) => l.code === currentLanguage)
                      ?.name || "Unknown"}
                  </div>
                </div>
                {isLoading && (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #6366f1",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Browser Language
              </h4>
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "14px", color: "#6b7280" }}>
                  {browserLanguage?.toUpperCase() || "Not detected"}
                </div>
                {browserLanguage && browserLanguage !== currentLanguage && (
                  <button
                    onClick={resetToBrowser}
                    style={{
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#059669";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#10b981";
                    }}
                  >
                    Switch
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Available Languages ({availableLanguages.length})
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    disabled={lang.code === currentLanguage || isLoading}
                    style={{
                      backgroundColor:
                        lang.code === currentLanguage ? "#6366f1" : "white",
                      color:
                        lang.code === currentLanguage ? "white" : "#374151",
                      border:
                        lang.code === currentLanguage
                          ? "none"
                          : "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                      cursor:
                        lang.code === currentLanguage || isLoading
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "left",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.2s",
                      opacity:
                        lang.code === currentLanguage || isLoading ? 1 : 0.8,
                    }}
                    onMouseEnter={(e) => {
                      if (lang.code !== currentLanguage && !isLoading) {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                        e.currentTarget.style.opacity = "1";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (lang.code !== currentLanguage && !isLoading) {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.opacity = "0.8";
                      }
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {lang.code.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          opacity: 0.8,
                          marginTop: "2px",
                        }}
                      >
                        {lang.name}
                      </div>
                    </div>
                    {lang.code === currentLanguage && (
                      <span style={{ fontSize: "16px" }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Translation Stats
              </h4>
              <div
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Keys Loaded:
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {translationCount}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Languages:
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {Object.keys(namespaceTranslations).length}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Actions
              </h4>
              <button
                onClick={resetToDefault}
                disabled={isLoading}
                style={{
                  backgroundColor: "white",
                  color: "#ef4444",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  width: "100%",
                  transition: "all 0.2s",
                  opacity: isLoading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = "#ef4444";
                    e.currentTarget.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#ef4444";
                  }
                }}
              >
                Reset to Default Language
              </button>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "12px 16px",
              borderTop: "1px solid #e5e7eb",
              fontSize: "12px",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            💡 Dev mode only • Press ESC to close
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
