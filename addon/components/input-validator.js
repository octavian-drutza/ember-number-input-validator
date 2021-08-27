import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
/* import { later } from '@ember/runloop'; */

export default class InputValidatorComponent extends Component {
  restrictedSymb;
  minlength = '13';
  maxlength = '13';
  @tracked value;
  @tracked error = false;
  @tracked validated = false;

  @action
  validateInput(event) {
    this.restrictedSymb = /[^0-9]/g;
    this.value = event.target.value.replace(this.restrictedSymb, '');
    if (event.key == 'Backspace' || 'Delete') {
      this.error = false;
    }
    [this.restrictedSymb, this.error] = [...this.validateSymbol(this.value)];
    this.args.value(this.value);
    this.validated = this.validateFinal(this.value, this.minlength, this.error);
    this.args.validated(this.validated);
  }

  /* check each symbol according to restricted */
  validateSymbol(value) {
    let restrictedSymb;
    let error = false;
    if (value) {
      [...value].forEach((sym, pos) => {
        restrictedSymb = this.returnRestricted(pos, value);
        error += this.toggleError(sym, restrictedSymb);
      });
    }
    return [restrictedSymb, error];
  }

  /* check if value is final and set validated param */
  validateFinal(value, minlength, error) {
    return value.length == minlength && error == false ? true : false;
  }

  /* trigger error in case of unacceptable number */
  toggleError(symbol, restricted) {
    return symbol.match(restricted) ? true : false;
  }

  /* check number according to position, more complex verifications have dedicated methods */
  returnRestricted(position, value) {
    switch (position) {
      case 0:
        return /[^1,2,5,6,7,8]/g;
      case 3:
        return /[^0,1]/g;
      case 5:
        return /[^0,1,2,3]/g;
      case 7:
        return /[^0,1,2,3,4,5,8]/g;
      case 8:
        return this.verifyJ2(value[position - 1]);
      case 12:
        return this.verifyC(value);
      default:
        return /[^0-9]/g;
    }
  }

  verifyJ2(prevValue) {
    if (prevValue == 4) {
      return /[^0-8]/g;
    } else if (prevValue == 5) {
      return /[^0,1]/g;
    } else {
      return /[^0-9]/g;
    }
  }

  verifyC(value) {
    let v = [...value];
    v.pop();
    let verConst = '279146358279';
    let sumConst = v.reduce((acc, cur, ind) => {
      let tempVal = cur * verConst[ind];
      acc += tempVal;
      return parseInt(acc);
    }, 0);
    let resConst = sumConst % 11;
    return resConst < 10 ? new RegExp(`[^${resConst}]`, 'g') : /[^1]/g;
  }
}
