var App = function() {
  var host = 'http://localhost';
  var port = 4567;
  var base_url = host + ':' + port;
  
  return ({
    init: function() {
      this.confirmation_message = 'Are you absolutely sure?';
      this.ajax_timeout = 5000;
    },

    url: function(url) {
      return (base_url + '/' + url);
    }
  });
}();

Ext.onReady(App.init, App);
