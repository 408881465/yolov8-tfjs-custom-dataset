import { MIN_INPUT_SIZE, MIN_INPUT_OPACITY, OVERLAY_MODE } from  '../../constants';
import Overlay, { OverlaySettingsType } from '../components/overlay';

export type DomAttributeType = {
  type: string;
  hasName: boolean,
  hasId: boolean,
  hasClass: boolean,
  hasText: boolean,
  disabled: boolean,
  tag: string,
  tagDiscriptor: string //this is only used to view the feature, should not be applied in training
};

export type CSSPropertyType = {
  textSecurity: string,
};

export const findAllInputFields = (): HTMLInputElement[] => {
  const inputs = <HTMLCollectionOf<HTMLInputElement>>document.getElementsByTagName('INPUT');
  return Array.from(inputs);
};

export const findVisibleInputs = (): HTMLInputElement[] => {
  const inputs = findAllInputFields(); 
  return inputs.filter(input => {
    const inputRect = input.getBoundingClientRect();
    // filter by size, must be larger than 2x2
    if (inputRect.width <= MIN_INPUT_SIZE.WIDTH || inputRect.height <= MIN_INPUT_SIZE.HEIGHT) {
      return false;
    }
    // filter by styling
    const cssStyle = window.getComputedStyle(input);
    // opacity should be greater than 0.2
    const opacity = parseFloat(cssStyle.opacity)
    if (opacity < MIN_INPUT_OPACITY) {
      return false;
    }
    // display should not be none
    const display = cssStyle.display;
    if (display === 'none') {
      return false;
    }
    // visibility should not be hidden
    const visibility = cssStyle.visibility;
    if (visibility === 'hidden') {
      return false;
    }
    return true;
  });
};

export const getDomAttributes = (input: HTMLInputElement): DomAttributeType => {
  return {
    type: input.type,
    hasName: !!input.name,
    hasId: !!input.id,
    hasClass: !!input.className,
    hasText: !!input.textContent.trim(),
    disabled: !!input.disabled,
    tag: input.tagName.toLocaleLowerCase(),
    tagDiscriptor: getTagDescriptor(input)
  }
};

export const getCSSProperties = (input: HTMLElement): CSSPropertyType => {
  const cssStyle = window.getComputedStyle(input);
  const textSecurity = cssStyle.getPropertyValue('-webkit-text-security');
  return {
    textSecurity
  };
};

export const highlightPendingDom = (dom: HTMLElement) => {
  if (!dom) {
    return;
  }
  dom.style.setProperty('border', '2px solid red', 'important');
};

export const highlightLabeledDom = (dom: HTMLElement) => {
  if (!dom) {
    return;
  }
  dom.style.setProperty('border', '2px solid blue', 'important');
};

export const restoreDomHighlight = (dom: HTMLElement) => {
  if (!dom) {
    return;
  }
  dom.style.setProperty('border', '');
};

export const getTagDescriptor = (dom: HTMLElement) => {
  const tagStr = dom.tagName.toLocaleLowerCase();
  const idStr = dom.id ? `#${dom.id}` : '';
  const classStr = typeof dom.className === 'string' ? `.${dom.className.split(' ').join('.')}` : '';
  return `${tagStr}${idStr}${classStr}`;
};

let positionTimer: ReturnType<typeof setInterval>;
export const addTooltipUnderDom = (dom: HTMLElement, overlay: Overlay) => {
  if (positionTimer) {
    clearInterval(positionTimer);
  }
  positionTimer = setInterval(() => {
    const domRect = dom.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const overlaySettings: OverlaySettingsType = {
      top: domRect.top - overlayRect.top + domRect.height + 5,
      left: domRect.left - overlayRect.left,
      mode: OVERLAY_MODE.TOOLTIP,
      text: getTagDescriptor(dom)
    }
    overlay.updateSettings(overlaySettings);
  }, 200);
};

export const clearOverlay = (overlay: Overlay) => {
  if (positionTimer) {
    clearInterval(positionTimer);
  }
  overlay.clear();
};
