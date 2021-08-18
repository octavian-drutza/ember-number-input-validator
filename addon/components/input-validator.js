import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InputValidatorComponent extends Component {
  @tracked value;
  @tracked error = false;
  restrictedSymb = /[^0-9]/g;

  @action
  validate(value) {
    if (value) {
      this.value = value.replace(this.restrictedSymb, '');
      this.error = this.toggleError(value.slice(value.length - 1));
    }
  }

  toggleError(symbol) {
    return symbol.match(this.restrictedSymb) ? true : false;
  }
}
