// Ember-I18n includes configuration for common locales. Most users
// can safely delete this file. Use it if you need to override behavior
// for a locale or define behavior for a locale that Ember-I18n
// doesn't know about.
export default {
	
  'user.edit.title': 'Edit User',
  'user.followers.title.one': 'One Follower',
  'user.followers.title.other': 'All {{count}} Followers',
// nested objects work just like dotted keys
  'button': {
    'add_user': {
      'title': 'Add a user',
      'text': 'Add',
      'disabled': 'Saving...'
    }
  }
  // rtl: [true|FALSE],
  //
  // pluralForm: function(count) {
  //   if (count === 0) { return 'zero'; }
  //   if (count === 1) { return 'one'; }
  //   if (count === 2) { return 'two'; }
  //   if (count < 5) { return 'few'; }
  //   if (count >= 5) { return 'many'; }
  //   return 'other';
  // }
};
