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
    },

    buildForm: function(opt) {
	    var defaults = {
        tag          : 'form', 
		    'data-remote': 'true',
        cn           : {
          tag  : 'input',
          id   : 'user_name',
		      type : 'text',
		      size : '30',
		      name : 'user_name',
		      value: 'john'
        }
	    };
      
	    var options = Ext.apply(defaults, opt);
      Ext.core.DomHelper.append(Ext.get('fixtures'), options);
    }
  });
}();

Ext.onReady(App.init, App);
