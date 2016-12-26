import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('comfirm-dialog', 'Integration | Component | comfirm dialog', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{comfirm-dialog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#comfirm-dialog}}
      template block text
    {{/comfirm-dialog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
