import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class InputValidatorComponent extends Component {
  restrictedSymb = /[^0-9]/g;
  @tracked value;
  @tracked error = false;

  @action
  validate(event) {
    this.value = event.target.value;
    let position = this.value.length - 1;
    if (this.value) {
      this.checkEach(this.value[position], position);
      this.error = this.toggleError(this.value[position]);
      if (this.error) {
        this.value = [
          ...[...this.value]
            .reverse()
            .join('')
            .replace(this.value[position], ''),
        ]
          .reverse()
          .join('');
        this.resetError();
      }
    }
    this.restrictedSymb = /[^0-9]/g;
  }

  resetError() {
    later(() => {
      this.error = false;
    }, 1500);
  }

  toggleError(symbol) {
    return symbol.match(this.restrictedSymb) ? true : false;
  }

  checkEach(num, position) {
    switch (position) {
      case 0:
        return this.verifyS(num);
      case 3:
        return this.verifyL1(num);
      case 5:
        return this.verifyZ1(num);
      case 7:
        return this.verifyJ1(num);
      case 8:
        return this.verifyJ2(num);
      case 11:
        this.generateC();
      default:
        this.restrictedSymb = /[^0-9]/g;
    }
  }

  verifyS() {
    this.restrictedSymb = /[^1,2,5,6,7,8]/g;
    console.log('value can not be 0 a 3 or a 4');
  }

  verifyL1() {
    this.restrictedSymb = /[^0,1]/g;
    console.log('value can only be a 0 or a 1');
  }

  verifyZ1() {
    this.restrictedSymb = /[^0,1,2,3]/g;
    console.log('value can only be between 0 and 3');
  }

  verifyJ1() {
    this.restrictedSymb = /[^0,1,2,3,4,5,8]/g;
    console.log('value can only be between 0 and 5 or 8');
  }

  verifyJ2() {
    this.restrictedSymb = /[^0-9]/g;
    if (this.value[7] == 4) {
      this.restrictedSymb = /[^0-8]/g;
    } else if (this.value[7] == 5) {
      this.restrictedSymb = /[^0,1]/g;
    }
    console.log(
      'if previous value is 7 this value can be from 0 to 8 if previous value is 5 this value can only be 1 or 0'
    );
  }

  generateC() {
    let v = [...this.value];
    let tempRes =
      (v[0] * 2 +
        v[1] * 7 +
        v[2] * 9 +
        v[3] +
        v[4] * 4 +
        v[5] * 6 +
        v[6] * 3 +
        v[7] * 5 +
        v[8] * 8 +
        v[9] * 2 +
        v[10] * 7 +
        v[11] * 9) %
      11;
    console.log(tempRes);
    tempRes < 10
      ? (this.value = this.value.concat('', tempRes))
      : (this.value = this.value.concat('', 1));
  }
}
