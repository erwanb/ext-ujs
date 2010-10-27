(function() {
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

  var sendWithDataMethod = function(element) {
    var templateValues = {method: element.getAttribute('data-method'),
                          href  : element.getAttribute('href')};
    var csrfParam      = Ext.select('meta[name=csrf-param]').item(0);
    var csrfToken      = Ext.select('meta[name=csrf-token]').item(0);
    var formTemplate   = ['<form style="display:none" method="post" action="{href}">',
                          '<input name="_method" value="{method}" type="hidden" />',
                          '</form>'];
    var csrfTemplate   = '<input name="{csrfParam}" value="{csrfToken}" type="hidden" />';

    if (csrfParam != null && csrfToken != null) {
      formTemplate.splice(2, 0, csrfTemplate);
      Ext.apply(templateValues, {csrfParam: csrfParam.getAttribute('content'),
                                 csrfToken: csrfToken.getAttribute('content')});
    }
    
    var template = new Ext.Template(formTemplate);
    var form = template.append(Ext.getBody(), templateValues);
    form.submit();
  } 

  var onClick = function(event, element) {
    var element     = Ext.get(element);
    var dataConfirm = element.getAttribute('data-confirm');
    var dataRemote  = element.getAttribute('data-remote');
    var dataMethod  = element.getAttribute('data-method');

    if (!dataConfirm || confirm(dataConfirm)) {
      if (dataRemote) {
        event.preventDefault();
        element.callRemote();
      } else if (dataMethod) {
        sendWithDataMethod(element);
      }
    } else {
      event.stopEvent();
    }
  }

  var disableWithInput = function(event, element) {
    Ext.fly(element).select('input[data-disable-with]').each(function(input) {
      input.set({'data-enable-with': input.getValue(),
                 value             : input.getAttribute('data-disable-with'),
                 disabled          : 'disabled'});
    });
  };

  var enableWithInput = function(event, element) {
    Ext.fly(element).select('input[data-disable-with]').each(function(input) {
      input.set({value             : input.getAttribute('data-enable-with'),
                 'data-enable-with': null,
                 disabled          : null});
    });
  }
  
  Ext.getBody().on("click", onClick, this,
                   {delegate: 'a:any([data-confirm]|[data-remote]|[data-method])'});
  Ext.getBody().on("click", onClick, this,
                   {delegate: 'input:any([data-confirm]|[data-remote])'});
  Ext.getBody().on("submit", onClick, this,
                   {delegate: 'form[data-remote]'});
  Ext.getBody().on('submit', disableWithInput, this,
                   {delegate: 'form:has(input[data-disable-with])'});
  Ext.getBody().on('ajax:complete', enableWithInput, this,
                   {delegate: 'form:has(input[data-disable-with])'});
})();