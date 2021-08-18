import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import typeIn from '@ember/test-helpers/dom/type-in';

module('Integration | Component | input-validator', function (hooks) {
  setupRenderingTest(hooks);

  test('assert all parts of the component exist', async function (assert) {
    assert.expect(3);

    /* render addon component */

    await render(hbs`<InputValidator @labelTitle={{'Input IDNO'}}/>`);

    /* check if all elements rendered */
    assert.dom('[ data-test-input-label ]').exists();
    assert.dom('[ data-test-input]').exists();
    assert.dom('[ data-test-message-error]').exists();
  });

  test('ensure user can pass all attributes', async function (assert) {
    assert.expect(3);

    /* declare values use in the test */
    let testValue1 = 'label';
    let testValue2 = 'error';
    let testValue3 = '8';

    /* assign attributes values */
    this.set('labelTitle', testValue1);
    this.set('errorMessage', testValue2);
    this.set('inputLength', testValue3);

    /* render addon component */
    await render(
      hbs`<InputValidator @labelTitle={{this.labelTitle}} @errorMessage={{this.errorMessage}} @inputLength={{this.inputLength}}/>`
    );

    /* user can pass label */
    assert.dom('[ data-test-input-label ]').hasText(testValue1);

    /* user can pass error message */
    assert.dom('[ data-test-message-error ]').hasText(testValue2);

    /* user can pass input maxLenght */
    assert.dom('[ data-test-input]').hasAttribute('maxLength', testValue3);
  });

  test('error message should toggle its own visibility', async function (assert) {
    assert.expect(2);

    /* render addon component */

    await render(hbs`<InputValidator @labelTitle={{'Input IDNO'}}/>`);

    /* input a non numerical symbol to unhide the element by removing display: none style property  */
    await typeIn('Input', 'f');

    assert
      .dom('[ data-test-message-error]')
      .doesNotHaveStyle({ display: 'none' });

    /* input a numererical symbol to hide the element by setting property disaplay to none*/

    await typeIn('Input', '1');

    assert.dom('[ data-test-message-error]').hasStyle({ display: 'none' });
  });

  test('input should not be accepting non numerical chars', async function (assert) {
    assert.expect(3);

    /* declare values use in the test */
    let testValue1 = 'afg/';
    let testValue2 = '123';

    /* render addon component */

    await render(hbs`<InputValidator @labelTitle={{'Input IDNO'}}/>`);

    /* input a non numerical string  */
    await typeIn('Input', testValue1);

    assert.equal(
      this.element.querySelector('Input').value,
      '',
      'when initially passed a non numerical string input should remain empty'
    );

    /* input a numerical string  */
    await typeIn('Input', testValue2);

    assert.ok(
      (this.element.querySelector('Input').value = testValue2),
      'input accepts an all numerical string'
    );

    /* input a nonnumerical string  */
    await typeIn('Input', 'afg/');

    assert.ok(
      (this.element.querySelector('Input').value = testValue2),
      'when trying to add non numerical chars to previous value, input value should stay unchanged'
    );
  });
});
