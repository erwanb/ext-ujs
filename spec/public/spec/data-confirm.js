describe('data-confirm', function() {
  var fixtures;
  this.selector;
  
  beforeEach(function() {
    fixtures = Ext.get('fixtures');
  });

  afterEach(function() {
    fixtures.update('');
  });

  describe("With a 'a' tag", function() {
    beforeEach(function() {
      Ext.DomHelper.append(fixtures, {
        tag           : 'a',
        href          : App.url('show'),
        'data-remote' : 'true',
        'data-confirm': 'Are you absolutely sure?',
        html          : 'my social security number'
      });
      this.selector = 'a[data-confirm]';
    });

    afterEach(function() {
      Ext.select(this.selector).removeAllListeners();
    });

    it("should send request if user confirm",    doSendRequestWhenConfirmed);
    it("should not send request if user cancel", doNotSendRequestWhenCanceled);
  });

  describe("With a 'input' tag", function() {
    beforeEach(function() {
      Ext.DomHelper.append(fixtures, {
        tag           : 'input',
        href          : App.url('show'),
        'data-remote' : 'true',
        'data-confirm': App.confirmation_message,
	      name          : 'submit',
			  type          : 'submit',
			  value         : 'Click me'
      });
      this.selector = 'input[data-confirm]';
    });
    
    afterEach(function() {
      Ext.select(this.selector).removeAllListeners();
    });

    it("should send request if user confirm",    doSendRequestWhenConfirmed);
    it("should not send request if user cancel", doNotSendRequestWhenCanceled);
  });
});

function doSendRequestWhenConfirmed() {
	window.confirm = function(msg) {
    Ext.getBody().set({'confirmation-message': msg});
		return true;
	};

  var callback = {
    onAjaxSuccessCalled: false,
    onAjaxSuccess : function(event) { 
      var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
      expect(request_env['PATH_INFO']).toEqual('/show');
      expect(request_env['REQUEST_METHOD']).toEqual('GET');
      expect(Ext.getBody().getAttribute('confirmation-message')).
        toEqual(App.confirmation_message);
      callback.onAjaxSuccessCalled = true;
    }
  };
  spyOn(callback, 'onAjaxSuccess').andCallThrough();

  runs(function() {
    link = Ext.select(this.env.currentSpec.selector);
    link.on('ajax:success', callback.onAjaxSuccess);
    link.fireEvent("click");
  });
  waitsFor(function() {return(callback.onAjaxSuccessCalled)});
  runs(function() {
    expect(callback.onAjaxSuccess).toHaveBeenCalled();
  });
}

function doNotSendRequestWhenCanceled() {
  window.confirm = function(msg) {
		Ext.getBody().set({'confirmation-message': msg});
		return false;
	};

  var callback = {
    onAjaxBeforeCalled: false,
    onAjaxBefore: function(event) {callback.onAjaxBeforeCalled = true;}
  };
  spyOn(callback, 'onAjaxBefore').andCallThrough();

  runs(function() {
    link = Ext.select(this.selector);
    link.on('ajax:before', callback.onAjaxBefore);
    link.fireEvent("click");
  });
  waits(100);
  runs(function() {
    expect(callback.onAjaxBefore).not.toHaveBeenCalled();
    expect(Ext.getBody().getAttribute('confirmation-message')).
      toEqual(App.confirmation_message);
  });
}