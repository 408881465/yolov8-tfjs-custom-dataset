import { storage } from 'webextension-polyfill';
import { GeneralFeature } from '../feature';
import { LabelData } from '../message';
import { FeatureCategory } from '../../constants';

export type GeneralFeatureLabeled = GeneralFeature & LabelData;

export const addFeature = async (category: FeatureCategory, feature: GeneralFeature) => {
  try {
    const storageGet = await storage.local.get(category);
    const currentFieldFeatures = storageGet[category] || [];
    currentFieldFeatures.push(feature);
    await storage.local.set({ [category]: currentFieldFeatures});
    return Promise.resolve(true);
  } catch (e) {
    return Promise.reject(false);
  }
};

export const getFeatures = async (category: FeatureCategory): Promise<Array<GeneralFeature>> => {
  try {
    const storageGet = await storage.local.get(category);
    return storageGet[category] || [];
  } catch (e) {
    return [];
  }
};

export const setFeatures = async (category: FeatureCategory, features: Array<GeneralFeature>): Promise<Array<GeneralFeature>> => {
  try {
    await storage.local.set({[category]: features});
    return features
  } catch (e) {
    return features;
  }
};

export const deleteFeature = async (category: FeatureCategory, idx: number): Promise<Array<GeneralFeature>> => {
  const features = await getFeatures(category);
  features.splice(idx, 1);
  const updated = await setFeatures(category, features);
  return updated;
}
