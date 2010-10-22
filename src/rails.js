Ext.onReady(function() {
  Ext.override(Ext.Element, {
    fireEvent: function(eventName, options) {
      if (document.createEvent) {
        // dispatch for firefox + others
        var event = document.createEvent("HTMLEvents");
        event.initEvent(eventName, true, true); // event type,bubbling,cancelable
        event.data = options;
        return this.dom.dispatchEvent(event);
      } else {
        // dispatch for IE
        var event = document.createEventObject();
        event.data = options;
        return this.dom.fireEvent('on' + eventName, event);
      }
    },
    
    callRemote: function() {
      var method = this.getAttribute('method') || this.getAttribute('data-method') || 'GET';
      var url    = this.getAttribute('action') || this.getAttribute('href');

      if (url === undefined) {
        throw "No URL specified for remote call (action or href must be present).";
      } else {
        if (!this.fireEvent("ajax:before")) {
          return (false);
        }
        var options = this.is('form') ? {form: this} : {};
        Ext.Ajax.request(Ext.apply(options, {
          url: url,
          method: method.toUpperCase(),
          scope: this,
          callback: function(options, success, response) {this.fireEvent("ajax:complete", response)},
          success: function(response) {this.fireEvent("ajax:success", response)},
          failure: function(response) {this.fireEvent("ajax:failure", response)}
        }));
        this.fireEvent("ajax:after");
      }
    }
  });
  
  /**
   * confirmation handler
   */
  Ext.getBody().on("click", function(event, element) {
    element = Ext.get(element);
    var message = element.getAttribute('data-confirm');
    if (confirm(message)) {
      element.set({"data-confirm-cancel": null});
    } else {
      element.set({"data-confirm-cancel": true});
      event.stopEvent();
    }
  }, this, {delegate: ':any(a|input)[data-confirm]'});

  /**
   * remote handlers
   */
  Ext.getBody().on("click", function(event, element) {
    event.preventDefault();
    Ext.get(element).callRemote();
  }, this, {delegate: ':any(a:not([data-confirm-cancel])|input:not([data-confirm-cancel]))[data-remote]'});
  
  Ext.getBody().on("submit", function(event, element) {
    event.preventDefault();
    Ext.get(element).callRemote();
  }, this, {delegate: 'form[data-remote]'});

  /**
   * disable-with handlers
   */
    
  var disable_with_input_function = function(event, element) {
    Ext.fly(element).select('input[data-disable-with]').each(function(input) {
      input.set({'data-enable-with': input.getValue(),
                 value             : input.getAttribute('data-disable-with'),
                 disabled          : 'disabled'});
    });
  };
  
  Ext.getBody().on('submit', disable_with_input_function, this,
                   {delegate: 'form:has(input[data-disable-with])'});

  Ext.getBody().on('ajax:complete', function(event, element) {
    Ext.fly(element).select('input[data-disable-with]').each(function(input) {
      input.set({value             : input.getAttribute('data-enable-with'),
                 'data-enable-with': null,
                 disabled          : null});
    });
  }, this, {delegate: 'form:has(input[data-disable-with])'});
});