import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ty-progressbar', 'Integration | Component | ty progressbar', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ty-progressbar}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ty-progressbar}}
      template block text
    {{/ty-progressbar}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
