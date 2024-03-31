import '@webcomponents/webcomponentsjs';
import * as browser from 'webextension-polyfill';
import {
  findVisibleInputs,
  findUsernameInputs,
  findPasswordInputs,
  restoreDomHighlight,
  addTooltipUnderDom,
  clearOverlay,
  highlightLabeledDoms
} from './utils/dom';
import { handleLabel, handlePredict } from './message';
import './components/overlay';
import Overlay from './components/overlay';
import { WEBCOURT_UID, Message, MessageType } from '../constants';

let currentSelectedDom: HTMLElement;
document.addEventListener('contextmenu', (evt) => {
  if (currentSelectedDom) {
    //restoreDomHighlight(currentSelectedDom);
  }
  clearOverlay(overlay);
  const target = evt.target as HTMLElement;
  if (!target) {
    console.log('No HTMLElement');
    return;
  }
  currentSelectedDom = target;
  //highlightPendingDom(currentSelectedDom);
  //addTooltipUnderDom(currentSelectedDom, overlay);
});

// setInterval(() => {
//   const allVisiableInputs = findVisibleInputs();
//   const textInputs = findUsernameInputs(allVisiableInputs);
//   const passwordInputs = findPasswordInputs(allVisiableInputs);
//   highlightLabeledDoms([...textInputs, ...passwordInputs], 'green');
// }, 1000);

document.addEventListener('keyup', (evt) => {
  //TODO use +/- to navigate to parent/children
});

// add overlay at the bottom of the body
const overlay = document.createElement('wc-overlay') as Overlay;
const overlayRectForm = document.createElement('wc-overlay') as Overlay;
const overlayRectButton = document.createElement('wc-overlay') as Overlay;
const overlaySaveButton = document.createElement('wc-overlay') as Overlay;

overlay.id = `${WEBCOURT_UID}-overlay`;
overlayRectForm.id = `${WEBCOURT_UID}-overlayForm`;
overlayRectButton.id = `${WEBCOURT_UID}-overlayButton`;
overlaySaveButton.id = `${WEBCOURT_UID}-overlaySave`;

const overlays = [overlay, overlayRectForm, overlayRectButton, overlaySaveButton];
document.body.append(...overlays);

// register message listener
browser.runtime.onMessage.addListener((message: Message, sender: browser.Runtime.MessageSender) => {
  switch (message.type) {
    case MessageType.CONTEXT_CLICK: {
      return handleLabel(message, currentSelectedDom, overlays);
    }
    case MessageType.BTN_FEATURE_COLLECT: {
      handlePredict(message);
      break;
    }
    case MessageType.PREDICT_RESULT: {
      const data = message.data;
      const windowWidth = window.screen.width;
      const windowHeight = window.screen.height;
      data.forEach((d: any) => {
        debugger;
        const {box, klass, score, ratios} = d;
        const {imgWidth, imgHeight} = ratios;
        const xr = windowWidth / imgWidth;
        const yr = windowHeight / imgHeight;
        box[0] *= xr; // x
        box[1] *= yr; // y
        box[2] *= xr; // width
        box[3] *= yr; // height
      })
      console.log(69, message)
      break;
    }
    default:
      break;
  }
});
