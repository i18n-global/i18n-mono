"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useI18nContext } from "./I18nProvider";
export function I18NexusDevtools({ initialIsOpen = false, position = "bottom-left", panelStyles = {}, buttonStyles = {}, }) {
    const { currentLanguage, changeLanguage, availableLanguages, languageManager, isLoading, translations, } = useI18nContext();
    const [isOpen, setIsOpen] = React.useState(initialIsOpen);
    const [isDragging, setIsDragging] = React.useState(false);
    const browserLanguage = languageManager.detectBrowserLanguage();
    React.useEffect(() => {
        const handleEscape = (e) => {
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
    const getPositionStyles = () => {
        const baseStyles = {
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
    const handleLanguageChange = async (lang) => {
        try {
            await changeLanguage(lang);
        }
        catch (error) {
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
    const currentTranslations = translations[currentLanguage] || {};
    const translationCount = Object.keys(currentTranslations).length;
    return (_jsxs("div", { style: getPositionStyles(), children: [!isOpen && (_jsxs("button", { onClick: toggleOpen, style: {
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
                }, onMouseEnter: (e) => {
                    e.currentTarget.style.backgroundColor = "#4f46e5";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
                }, onMouseLeave: (e) => {
                    e.currentTarget.style.backgroundColor = "#6366f1";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }, children: [_jsx("span", { style: { fontSize: "18px" }, children: "\uD83C\uDF10" }), _jsx("span", { children: "i18nexus" })] })), isOpen && (_jsxs("div", { style: {
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                    width: "400px",
                    maxHeight: "600px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    ...panelStyles,
                }, children: [_jsxs("div", { style: {
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            color: "white",
                            padding: "16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: isDragging ? "grabbing" : "grab",
                        }, onMouseDown: () => setIsDragging(true), onMouseUp: () => setIsDragging(false), children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [_jsx("span", { style: { fontSize: "20px" }, children: "\uD83C\uDF10" }), _jsx("h3", { style: { margin: 0, fontSize: "16px", fontWeight: "600" }, children: "i18nexus Devtools" })] }), _jsx("button", { onClick: toggleOpen, style: {
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
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                                }, children: "\u2715" })] }), _jsxs("div", { style: {
                            padding: "16px",
                            overflowY: "auto",
                            flex: 1,
                        }, children: [_jsxs("div", { style: { marginBottom: "20px" }, children: [_jsx("h4", { style: {
                                            margin: "0 0 12px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }, children: "Current Language" }), _jsxs("div", { style: {
                                            backgroundColor: "#f3f4f6",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: "18px", fontWeight: "600" }, children: currentLanguage.toUpperCase() }), _jsx("div", { style: { fontSize: "12px", color: "#6b7280" }, children: availableLanguages.find((l) => l.code === currentLanguage)
                                                            ?.name || "Unknown" })] }), isLoading && (_jsx("div", { style: {
                                                    width: "20px",
                                                    height: "20px",
                                                    border: "2px solid #6366f1",
                                                    borderTopColor: "transparent",
                                                    borderRadius: "50%",
                                                    animation: "spin 1s linear infinite",
                                                } }))] })] }), _jsxs("div", { style: { marginBottom: "20px" }, children: [_jsx("h4", { style: {
                                            margin: "0 0 12px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }, children: "Browser Language" }), _jsxs("div", { style: {
                                            backgroundColor: "#f3f4f6",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                        }, children: [_jsx("div", { style: { fontSize: "14px", color: "#6b7280" }, children: browserLanguage?.toUpperCase() || "Not detected" }), browserLanguage && browserLanguage !== currentLanguage && (_jsx("button", { onClick: resetToBrowser, style: {
                                                    backgroundColor: "#10b981",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    padding: "6px 12px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    fontWeight: "500",
                                                    transition: "background 0.2s",
                                                }, onMouseEnter: (e) => {
                                                    e.currentTarget.style.backgroundColor = "#059669";
                                                }, onMouseLeave: (e) => {
                                                    e.currentTarget.style.backgroundColor = "#10b981";
                                                }, children: "Switch" }))] })] }), _jsxs("div", { style: { marginBottom: "20px" }, children: [_jsxs("h4", { style: {
                                            margin: "0 0 12px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }, children: ["Available Languages (", availableLanguages.length, ")"] }), _jsx("div", { style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                        }, children: availableLanguages.map((lang) => (_jsxs("button", { onClick: () => handleLanguageChange(lang.code), disabled: lang.code === currentLanguage || isLoading, style: {
                                                backgroundColor: lang.code === currentLanguage ? "#6366f1" : "white",
                                                color: lang.code === currentLanguage ? "white" : "#374151",
                                                border: lang.code === currentLanguage
                                                    ? "none"
                                                    : "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                padding: "12px",
                                                cursor: lang.code === currentLanguage || isLoading
                                                    ? "not-allowed"
                                                    : "pointer",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                textAlign: "left",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                transition: "all 0.2s",
                                                opacity: lang.code === currentLanguage || isLoading ? 1 : 0.8,
                                            }, onMouseEnter: (e) => {
                                                if (lang.code !== currentLanguage && !isLoading) {
                                                    e.currentTarget.style.backgroundColor = "#f3f4f6";
                                                    e.currentTarget.style.opacity = "1";
                                                }
                                            }, onMouseLeave: (e) => {
                                                if (lang.code !== currentLanguage && !isLoading) {
                                                    e.currentTarget.style.backgroundColor = "white";
                                                    e.currentTarget.style.opacity = "0.8";
                                                }
                                            }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontWeight: "600" }, children: lang.code.toUpperCase() }), _jsx("div", { style: {
                                                                fontSize: "12px",
                                                                opacity: 0.8,
                                                                marginTop: "2px",
                                                            }, children: lang.name })] }), lang.code === currentLanguage && (_jsx("span", { style: { fontSize: "16px" }, children: "\u2713" }))] }, lang.code))) })] }), _jsxs("div", { style: { marginBottom: "20px" }, children: [_jsx("h4", { style: {
                                            margin: "0 0 12px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }, children: "Translation Stats" }), _jsxs("div", { style: {
                                            backgroundColor: "#f3f4f6",
                                            padding: "12px",
                                            borderRadius: "8px",
                                        }, children: [_jsxs("div", { style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    marginBottom: "8px",
                                                }, children: [_jsx("span", { style: { fontSize: "14px", color: "#6b7280" }, children: "Keys Loaded:" }), _jsx("span", { style: { fontSize: "14px", fontWeight: "600" }, children: translationCount })] }), _jsxs("div", { style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                }, children: [_jsx("span", { style: { fontSize: "14px", color: "#6b7280" }, children: "Languages:" }), _jsx("span", { style: { fontSize: "14px", fontWeight: "600" }, children: Object.keys(translations).length })] })] })] }), _jsxs("div", { children: [_jsx("h4", { style: {
                                            margin: "0 0 12px 0",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#374151",
                                        }, children: "Actions" }), _jsx("button", { onClick: resetToDefault, disabled: isLoading, style: {
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
                                        }, onMouseEnter: (e) => {
                                            if (!isLoading) {
                                                e.currentTarget.style.backgroundColor = "#ef4444";
                                                e.currentTarget.style.color = "white";
                                            }
                                        }, onMouseLeave: (e) => {
                                            if (!isLoading) {
                                                e.currentTarget.style.backgroundColor = "white";
                                                e.currentTarget.style.color = "#ef4444";
                                            }
                                        }, children: "Reset to Default Language" })] })] }), _jsx("div", { style: {
                            backgroundColor: "#f9fafb",
                            padding: "12px 16px",
                            borderTop: "1px solid #e5e7eb",
                            fontSize: "12px",
                            color: "#6b7280",
                            textAlign: "center",
                        }, children: "\uD83D\uDCA1 Dev mode only \u2022 Press ESC to close" })] })), _jsx("style", { children: `
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        ` })] }));
}
//# sourceMappingURL=I18NexusDevtools.js.map