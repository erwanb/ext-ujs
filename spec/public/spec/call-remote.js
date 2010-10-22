var App = App || {};

App.build_form = function(opt) {
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

  Ext.DomHelper.append(Ext.get('fixtures'), options);
};

describe('call-remote', function() {
  var fixtures;

  beforeEach(function() {
    fixtures = Ext.get('fixtures');
  });
  
  afterEach(function() {
    fixtures.update('');
  });

  describe("when method attribute is present", function() {
    beforeEach(function() {
      App.build_form({
        'method'     : 'post',
        'data-method': 'get',
        'action'     : App.url('update')
      });
    });

    it("pick method from method attribute and not from data-method", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
         
          expect(request_env['REQUEST_METHOD']).toEqual('POST');
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
    });        
  });

  describe("when method attribute is missing", function() {
    beforeEach(function() {
      App.build_form({
        'data-method': 'post',
        'action'     : App.url('update')
      });
    });

    it("pick method from method attribute and not from data-method", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
         
          expect(request_env['REQUEST_METHOD']).toEqual('POST');
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
    });        
  });

  describe("when both method ant data-method attributes are missing", function() {
    beforeEach(function() {
      App.build_form({
        'action': App.url('show')
      });
    });

    it("fallback to GET method", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
         
          expect(request_env['REQUEST_METHOD']).toEqual('GET');
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
    });        
  });

  describe("When action attribute is present", function() {
    beforeEach(function() {
      App.build_form({
        'action': App.url('show')
      });
    });

    it("pick url from action attribute", function() {
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
    });
  });

  describe("When both action and href attributes are present", function() {
    beforeEach(function() {
      App.build_form({
        'action': App.url('show'),
        'href'  : 'http://example.org'
      });
    });

    it("pick url from action attribute", function() {
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
    });
  });

  describe("When action attribute is missing and href attribute is present", function() {
    beforeEach(function() {
      App.build_form({
        'href': App.url('show')
      });
    });

    it("pick url from href attribute", function() {
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
    });
  });

  describe("When both action and href attributes are missing", function() {
    beforeEach(function() {
      App.build_form({});
    });

    it("throws an exception", function() {
      form = Ext.select("form[data-remote]");
      expect(form.fireEvent.createCallback('submit')).toThrow("this.invoke is not a function");
    });
  });
});