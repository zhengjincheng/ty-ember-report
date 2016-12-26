// app/instance-initializers/i18n.js

export default {
  name: 'i18n',
  initialize: function(appInstance) {
    appInstance.lookup('service:i18n').set('locale', calculateLocale());
  }
}

function calculateLocale() {
  // whatever123 you do to pick a locale for the user:
  return 'en';
  //return navigator.language || navigator.userLanguage || 'en';
}