import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ty-progressbar2', 'Integration | Component | ty progressbar2', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ty-progressbar2}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ty-progressbar2}}
      template block text
    {{/ty-progressbar2}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
