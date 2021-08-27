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
    await render(hbs`<InputValidator @label={{'label'}}/>`);

    /* check if all elements rendered */
    assert.dom('[ data-test-input-label ]').exists();
    assert.dom('[ data-test-input]').exists();
    assert.dom('[ data-test-message-error]').exists();
  });

  test('ensure user can pass all attributes', async function (assert) {
    assert.expect(1);

    /* render addon component */
    await render(hbs`<InputValidator @label={{"label"}} }/>`);

    /* user can pass label */
    assert.dom('[ data-test-input-label ]').hasText('label');
  });

  test('error message should toggle its own visibility', async function (assert) {
    assert.expect(2);

    /* render addon component */
    await render(hbs`<InputValidator
    @label={{"label"}}
    @value={{fn (mut this.value)}}
    @validated={{fn (mut this.validated)}}
  />`);

    /* input a valid numererical symbol to hide the element by setting property display to none */
    await typeIn('input', '1');
    assert.dom('[ data-test-message-error]').hasStyle({ display: 'none' });

    /* input an invalid first numerical symbol and trigger error */
    await typeIn('input', '234');
    assert
      .dom('[ data-test-message-error]')
      .doesNotHaveStyle({ display: 'none' });
  });

  test('input should not be accepting non numerical chars', async function (assert) {
    assert.expect(3);

    /* declare values use in the test */
    let testValue1 = 'a/';
    let testValue2 = '1';

    /* render addon component */
    await render(hbs`<InputValidator
    @label={{"label"}}
    @value={{fn (mut this.value)}}
    @validated={{fn (mut this.validated)}}
  />`);

    /* input a non numerical string  */
    await typeIn('input', testValue1);

    assert.equal(
      this.element.querySelector('input').value,
      '',
      'when initially passed a non numerical string input should remain empty'
    );

    /* input a valid first numerical string  */
    await typeIn('input', testValue2);

    assert.ok(
      (this.element.querySelector('input').value = testValue2),
      'input accepts a numerical string'
    );

    /* input a nonnumerical string  */
    await typeIn('input', 'afg/');
    assert.ok(
      (this.element.querySelector('input').value = testValue2),
      'when trying to add non numerical chars to previous value, input value should stay unchanged'
    );
  });

  test('input a full valid value for error check', async function (assert) {
    assert.expect(1);

    /* declare values use in the test */
    let goodValue = '1230124042737';

    /* render addon component */
    await render(hbs`<InputValidator
    @label={{"label"}}
    @value={{fn (mut this.value)}}
    @validated={{fn (mut this.validated)}}
  />`);

    /* input value  */
    await typeIn('input', goodValue);
    assert.dom('[ data-test-message-error]').hasStyle({ display: 'none' });
  });

  test('input a full invalid value for error check', async function (assert) {
    assert.expect(1);

    /* declare values use in the test */
    let badValue = '1230124042731';

    /* render addon component */
    await render(hbs`<InputValidator
    @label={{"label"}}
    @value={{fn (mut this.value)}}
    @validated={{fn (mut this.validated)}}
  />`);

    /* input value  */
    await typeIn('input', badValue);
    assert
      .dom('[ data-test-message-error]')
      .doesNotHaveStyle({ display: 'none' });
  });
});
