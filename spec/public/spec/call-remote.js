describe('call-remote', function() {
  var fixtures;

  beforeEach(function() {
    fixtures = Ext.get('fixtures');
  });
  
  afterEach(function() {
    fixtures.update('');
  });
  
  describe("with a link", function() {
    describe("when data-method attribute is present", function() {
      beforeEach(function() {
        Ext.core.DomHelper.append(fixtures, {
          tag           : 'a',
          href          : App.url('update'),
          'data-remote' : 'true',
          'data-method' : "post"
        });
      });

      it("pick method from data-method", clickLinkAndExpectMethod.createCallback('POST'));
    });
  });
  
  describe("with a form", function() {
    describe("when method attribute is present", function() {
      beforeEach(function() {
        App.buildForm({
          'method'     : 'post',
          'data-method': 'get',
          'action'     : App.url('update')
        });
      });

      it("pick method from method attribute and not from data-method", submitFormAndExpectMethod.createCallback('POST'));
    });

    describe("when method attribute is missing", function() {
      beforeEach(function() {
        App.buildForm({
          'data-method': 'post',
          'action'     : App.url('update')
        });
      });

      it("pick doesn't pick method from data-method", submitFormAndExpectMethod.createCallback('GET'));
    });

    describe("when both method ant data-method attributes are missing", function() {
      beforeEach(function() {
        App.buildForm({
          'action': App.url('show')
        });
      });

      it("fallback to GET method", submitFormAndExpectMethod.createCallback('GET'));
    });

    describe("When action attribute is present", function() {
      beforeEach(function() {
        App.buildForm({'action': App.url('show')});
      });
      
      it("pick url from action attribute", submitFormAndExpectUrl);      
    });

    describe("When both action and href attributes are present", function() {
      beforeEach(function() {
        App.buildForm({
          'action': App.url('show'),
          'href'  : 'http://example.org'
        });
      });

      it("pick url from action attribute", submitFormAndExpectUrl);
    });

    describe("When action attribute is missing and href attribute is present", function() {
      beforeEach(function() {
        App.buildForm({'href': App.url('show')});
      });
      
      it("pick url from href attribute", submitFormAndExpectUrl);
    });

    describe("When both action and href attributes are missing", function() {
      beforeEach(function() {
        App.buildForm({});
      });

      it("throws an exception", function() {
        form = Ext.select("form[data-remote]");
        expect(form.fireEvent.createCallback('submit')).toThrow();
      });
    });
  });
});

function clickLinkAndExpectMethod(expectedMethod) {
  var callback = {
    onAjaxSuccessCalled: false,
    onAjaxSuccess : function(event) { 
      var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
      
      expect(request_env['REQUEST_METHOD']).toEqual(expectedMethod);
      callback.onAjaxSuccessCalled = true;
    }
  };
  spyOn(callback, 'onAjaxSuccess').andCallThrough();
  
  runs(function() {
    link = Ext.select("a[data-remote]");
    link.on('ajax:success', callback.onAjaxSuccess);
    link.fireEvent('click');
  });
  waitsFor(function() {return(callback.onAjaxSuccessCalled)});
  runs(function() {
    expect(callback.onAjaxSuccess).toHaveBeenCalled();
  });
}

function submitFormAndExpectMethod(expectedMethod) {
  var callback = {
    onAjaxSuccessCalled: false,
    onAjaxSuccess : function(event) { 
      var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
      
      expect(request_env['REQUEST_METHOD']).toEqual(expectedMethod);
      callback.onAjaxSuccessCalled = true;
    }
  };
  spyOn(callback, 'onAjaxSuccess').andCallThrough();
  
  runs(function() {
    form = Ext.select("form[data-remote]");
    form.on('ajax:success', callback.onAjaxSuccess);
    form.fireEvent('submit');
  });
  waitsFor(function() {return(callback.onAjaxSuccessCalled)});
  runs(function() {
    expect(callback.onAjaxSuccess).toHaveBeenCalled();
  });
}

function submitFormAndExpectUrl() {
  var callback = {
    onAjaxSuccessCalled: false,
    onAjaxSuccess : function(event) { 
      var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
      
      expect(request_env['PATH_INFO']).toEqual('/show');
      callback.onAjaxSuccessCalled = true;
    }
  };
  spyOn(callback, 'onAjaxSuccess').andCallThrough();
  
  runs(function() {
    form = Ext.select("form[data-remote]");
    form.on('ajax:success', callback.onAjaxSuccess);
    form.fireEvent('submit');
  });
  waitsFor(function() {return(callback.onAjaxSuccessCalled)});
  runs(function() {
    expect(callback.onAjaxSuccess).toHaveBeenCalled();
  });
}