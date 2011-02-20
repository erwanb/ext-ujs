describe('data-remote', function() {
  var fixtures;

  beforeEach(function() {
    fixtures = Ext.get('fixtures');
  });
  
  afterEach(function() {
    fixtures.update('');
  });

  describe("With a 'a' tag", function() {
    beforeEach(function() {
      Ext.core.DomHelper.append(fixtures, {
        tag           : 'a',
        href          : App.url('show'),
        'data-remote' : 'true',
        html          : 'my address'
      });
    });

    it("sends an ajax request", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
          expect(request_env['PATH_INFO']).toEqual('/show');
          expect(request_env['REQUEST_METHOD']).toEqual('GET');
          callback.onAjaxSuccessCalled = true;
        }
      };
      spyOn(callback, 'onAjaxSuccess').andCallThrough();
      
      runs(function() {
        link = Ext.select("a[data-remote]");
        link.on('ajax:success', callback.onAjaxSuccess);
        link.fireEvent("click");
      });
      waitsFor(function() {return(callback.onAjaxSuccessCalled)});
      runs(function() {
        expect(callback.onAjaxSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("With a 'input' tag", function() {
    beforeEach(function() {
      Ext.core.DomHelper.append(fixtures, {
        tag           : 'input',
        href          : App.url('show'),
        'data-remote' : 'true',
        name          : 'submit',
        type          : 'submit',
        value         : 'Click me'
      });
    });

    it("sends an ajax request", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
          expect(request_env['PATH_INFO']).toEqual('/show');
          expect(request_env['REQUEST_METHOD']).toEqual('GET');
          callback.onAjaxSuccessCalled = true;
        }
      };
      spyOn(callback, 'onAjaxSuccess').andCallThrough();
      
      runs(function() {
        link = Ext.select("input[data-remote]");
        link.on('ajax:success', callback.onAjaxSuccess);
        link.fireEvent("click");
      });
      waitsFor(function() {return(callback.onAjaxSuccessCalled)});
      runs(function() {
        expect(callback.onAjaxSuccess).toHaveBeenCalled();
      });
    });
  });

  describe("With a form", function() {
    beforeEach(function() {
      Ext.core.DomHelper.append(fixtures, {
        tag           : 'form',
        'data-remote' : 'true',
        method        : 'post',
        action        : App.url('update'),
        cn            : [{
          tag           : 'input',
          type          : 'text',
          size          : '30',
          name          : 'user_name',
          value         : 'John'
        }]
      });
    });

    it("sends an ajax request", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) { 
          var request_env = Ext.decode(event.browserEvent.data.responseText)['request_env'];
          var params = request_env['rack.request.query_hash'];

          expect(request_env['PATH_INFO']).toEqual('/update');
          expect(request_env['REQUEST_METHOD']).toEqual('POST');
          expect(params['user_name']).toEqual('John');
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
});
