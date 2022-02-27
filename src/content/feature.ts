import { 
  DomAttributeType,
  CSSPropertyType,
  findVisibleInputs,
  findUsernameInputs,
  findPasswordInputs,
  getDomAttributes,
  getCSSProperties
} from './utils/dom';
import {
  GeoType,
  NearestType,
  getGeoFeature,
  getNearestInfo,
  getUsernamePasswordGeoFeature,
  SpacialType
} from './utils/geo';
import {
  getSpacialStatistics,
} from './utils/statistics';

export interface InputFeature extends GeoType, NearestType, DomAttributeType, CSSPropertyType {};

export interface GeneralFeature {
  [key: string]: number | string | boolean;
};

export interface PageFeature extends GeneralFeature {};

export interface AllFeature {
  inputFeatures: GeneralFeature[],
  pageFeature: GeneralFeature
};

export const getInputFeatures = (input: HTMLElement, inputs: HTMLInputElement[]): GeneralFeature => {
  // get geo features
  const inputGeoFeatures = getGeoFeature(input);
  // get dom features
  const inputDomFeatures = getDomAttributes(input);
  // get nearest features
  const inputNearestFeatures = getNearestInfo(input, inputs);
  // get css features
  const inputCSSFeatures = getCSSProperties(input);

  // merge all the features
  return {
    ...inputDomFeatures,
    ...inputGeoFeatures,
    ...inputNearestFeatures,
    ...inputCSSFeatures,
  }
};

export const getButtonFeatures = (button: HTMLElement, inputs: HTMLInputElement[]): GeneralFeature => {
  // get geo features
  const buttonGeoFeatures = getGeoFeature(button);
  // get dom features
  const buttonDomFeatures = getDomAttributes(button);
  // get nearest features to username inputs
  const usernameInputs = findUsernameInputs(inputs);
  const buttonNearestUsernameFeatures = getNearestInfo(button, usernameInputs);
  // get nearest features to password inputs
  const passwordInputs = findUsernameInputs(inputs);
  const buttonNearestPasswordFeatures = getNearestInfo(button, passwordInputs);

  // merge all the features
  return {
    ...buttonGeoFeatures,
    ...buttonDomFeatures,
    ...{
      nearUserX: buttonNearestUsernameFeatures.distNearestX,
      nearUserXP: buttonNearestUsernameFeatures.distNearestXP,
      nearUserY: buttonNearestUsernameFeatures.distNearestY,
      nearUserYP: buttonNearestUsernameFeatures.distNearestYP
    },
    ...{
      nearPassX: buttonNearestPasswordFeatures.distNearestX,
      nearPassXP: buttonNearestPasswordFeatures.distNearestXP,
      nearPassY: buttonNearestPasswordFeatures.distNearestY,
      nearPassYP: buttonNearestPasswordFeatures.distNearestYP
    }
  };
};

export const appendFeatureNames = (prefix: string, features: GeneralFeature) => {
  const appendedFeatures: GeneralFeature = {}
  for (const key  in features) {
    appendedFeatures[`${prefix}${key}`] = features[key];
  }
  return appendedFeatures;
};

export const getPageFeatures = (): GeneralFeature => {
  // get spacial feature for all inputs
  const allVisiableInputs = findVisibleInputs();
  //const spacialStatisticsAll = getSpacialStatistics(allVisiableInputs);
  //const spacialStatisticsAllFeature = appendFeatureNames('a-', spacialStatisticsAll);

  // get spacial feature for all username inputs
  const usernameInputs = findUsernameInputs(allVisiableInputs);
  const spacialStatisticsUsername = getSpacialStatistics(usernameInputs);
  const spacialStatisticsUsernameFeature = appendFeatureNames('u-', spacialStatisticsUsername);

  // get spacial feature for all password inputs
  const passwordInputs = findPasswordInputs(allVisiableInputs);
  const spacialStatisticsPassword = getSpacialStatistics(passwordInputs);
  const spacialStatisticsPasswordFeature = appendFeatureNames('p-', spacialStatisticsPassword);

  // get input counts
  const inputCounts = {
    allCount: allVisiableInputs.length,
    textCount: usernameInputs.length,
    passwordCount: passwordInputs.length
  }

  return {
    ...spacialStatisticsUsernameFeature,
    ...spacialStatisticsPasswordFeature,
    ...inputCounts
  };
};

export const getPageUsernamePasswordGeoFeatures = (): GeneralFeature => {
  const visibleInputs = findVisibleInputs();
  const feature = getUsernamePasswordGeoFeature(visibleInputs);
  const pageFeatureMapped: GeneralFeature = {};
  feature.forEach((f, idx) => {
    Object.keys(f).forEach((key: keyof SpacialType) => {
      pageFeatureMapped[`${idx}${key}`] = f[key];
    })
  });
  return pageFeatureMapped;
};

export const constructPageFeatureOrdered = (feature: GeneralFeature) => {
  // extract the ordered key and value
  const orderedKeys = ['label', 'url'];
  Object.keys(feature).forEach(key => {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  });
  const orderedValues = orderedKeys.map(key => feature[key]);
  return {
    key: orderedKeys,
    value: orderedValues
  };
};
