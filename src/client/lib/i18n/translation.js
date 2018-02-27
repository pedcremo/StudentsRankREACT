import * as en from './english.js';
import * as es from './spanish.js';
import * as val from './valencian.js';

function getTraductionOfMessages(language) {
    switch(language) {
      case "en":
        return en.default;
        break;
      case "es":
        return es.default;
        break;
      case "val":
        return val.default;
        break;
      default:
        return en.default;
        break;
    }
  }

export { getTraductionOfMessages }