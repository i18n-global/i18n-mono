import React from "react";
export interface I18NexusDevtoolsProps {
    /**
     * Set this true if you want the dev tools to default to being open
     */
    initialIsOpen?: boolean;
    /**
     * The position of the devtools panel
     * @default 'bottom-left'
     */
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    /**
     * Custom styles for the panel
     */
    panelStyles?: React.CSSProperties;
    /**
     * Custom styles for the button
     */
    buttonStyles?: React.CSSProperties;
}
export declare function I18NexusDevtools({ initialIsOpen, position, panelStyles, buttonStyles, }: I18NexusDevtoolsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=I18NexusDevtools.d.ts.map