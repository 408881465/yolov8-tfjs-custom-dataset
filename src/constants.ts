import { GeneralFeatureLabeled } from "./content/utils/storage";

export const WEBCOURT_UID = 'SrElXAlR4zOvfv8P';

export const MIN_INPUT_SIZE = {
  WIDTH: 5,
  HEIGHT: 5
};

export const MIN_INPUT_OPACITY = 0.2;

export const INPUT_TYPE_NONE = 'NONE';

export const CONTEXT_MENU_IDS = {
  LABEL_FIELD: 'LABEL_FIELD',
  LABEL_USERNAME: 'LABEL_USERNAME',
  LABEL_PASSWORD: 'LABEL_PASSWORD',
  LABEL_SUBMIT: 'LABEL_SUBMIT',
  LABEL_FIELD_OTHER: 'LABEL_FIELD_OTHER',
  LABEL_PAGE: 'LABEL_PAGE',
  LABEL_LOGIN: 'LABEL_LOGIN',
  LABEL_CHANGE_PASS: 'LABEL_CHANGE_PASS',
  LABEL_SIGNUP: 'LABEL_SIGNUP',
  LABEL_PAGE_OTHER: 'LABEL_PAGE_OTHER',
  LABEL_CLEAR_ALL: 'LABEL_CLEAR_ALL'
};

export enum OVERLAY_MODE {
  TOOLTIP,
  EMPTY
};

export const DEFAULT_OVERLAY_SETTINGS = {
  mode: OVERLAY_MODE.EMPTY,
  text: '',
  top: 0,
  left: 0
};

export enum MessageType {
  CONTEXT_CLICK
};

export interface Message {
  type: MessageType;
  action: string;
  data: object
};

export enum FieldLabelResult {
  username,
  password,
  submit,
  other
};

export enum PageLabelResult {
  login,
  change_pass,
  signup,
  other
};

export enum FeatureCategory {
  Field = 'Field',
  Page = 'Page',
  Submit = 'Submit'
};

export type FeaturesType = {
  [key in FeatureCategory]: GeneralFeatureLabeled[];
}

export enum InputFieldType {
  other,
  username,
  password,
  options,
  submit,
  time,
  values
};

export const PageInputMaxCount = 10; // collect 10 inputs at max 
