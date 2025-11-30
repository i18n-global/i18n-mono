import React from "react";
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
export declare function I18NexusDevtools({ initialIsOpen, position, panelStyles, buttonStyles, }: I18NexusDevtoolsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=I18NexusDevtools.d.ts.map