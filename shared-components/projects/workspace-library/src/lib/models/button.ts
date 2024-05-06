export interface Button {
    id?: string;
    icon?: string;
    imgUrl?: string;
    buttonType: ButtonType;
    buttonText: string;
    isRounded?: boolean;
    isPrimary?: boolean;
    className?: string;
    hideButton?: boolean;
    customWidthClass?: string,
    isVisible?: boolean;
    buttonVariant?: ButtonVariant;
    buttonCategory?: ButtonCategory;
    tooltip?: string,
    tooltipDirection?: TooltipDirection;
    tooltipClass?: string;
    callback(element?: any, item?: any): void;
    disableCallBack?(): boolean;
}

export enum ButtonVariant {
    stroked = 1,
    flat = 2,
    iconOnly = 3,
    anchorButton = 4,
    iconWithText = 5,
}

export enum ButtonType {
    default = 1,
    icon = 2,
    img = 3,
    imgWithText = 4,
    iconWithText = 5,
    anchorButton = 6,
}

export enum TooltipDirection {
    above = "above",
    below = "below",
    left = "left",
    right = "right"
}

export enum ButtonCategory {
    normal = 1,
    menubutton = 2,
}
