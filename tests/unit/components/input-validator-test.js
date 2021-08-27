import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import createComponent from 'dummy/tests/helpers/create-component';

module('Unit | Component | input-validator', function (hooks) {
  setupTest(hooks);

  test('testing input-validator component methods', async function (assert) {
    let model = { restrictedSymb: /[^0-9]/g };
    let component = createComponent('component:input-validator', model);
    /* error toggle */
    assert.equal(component.toggleError('u', model.restrictedSymb), true);
    /* triggering the restricted symbols */
    assert.deepEqual(component.returnRestricted(0), /[^1,2,5,6,7,8]/g);
    assert.deepEqual(component.returnRestricted(3), /[^0,1]/g);
    assert.deepEqual(component.returnRestricted(5), /[^0,1,2,3]/g);
    assert.deepEqual(component.returnRestricted(7), /[^0,1,2,3,4,5,8]/g);
    assert.deepEqual(component.verifyJ2(4), /[^0-8]/g);
    assert.deepEqual(component.verifyJ2(5), /[^0,1]/g);
    assert.deepEqual(component.verifyJ2(8), /[^0-9]/g);
    assert.deepEqual(component.verifyC('1230124042737'), /[^7]/g);
    assert.equal(component.validateFinal('1230124042737', 13, false), true);
    assert.equal(component.validateFinal('1230124042737', 14, false), false);
    assert.equal(component.validateFinal('123012404273', 13, false), false);
    assert.equal(component.validateFinal('1230124042737', 13, true), false);
    assert.deepEqual(component.validateSymbol('1')[0], /[^1,2,5,6,7,8]/g);
    assert.equal(component.validateSymbol('1')[1], false);
    assert.equal(component.validateSymbol('0')[1], true);
    assert.equal(component.validateSymbol('1230124042737')[1], false);
    assert.equal(component.validateSymbol('1230124042731')[1], true);
  });
});
