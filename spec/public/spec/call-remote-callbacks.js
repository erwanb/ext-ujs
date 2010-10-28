describe('call-remote', function() {
  var fixtures;

  beforeEach(function() {
    fixtures = Ext.get('fixtures');
    App.buildForm({
			'action': App.url('show')
		});
  });
  
  afterEach(function() {
    fixtures.update('');
  });

  describe("when ajax:before callback stop event", function() {
    it("doesn't send ajax request", function() {
      var callback = {
        onAjaxBeforeCalled: false,
        onAjaxBefore : function(event) {
          event.stopEvent();
          callback.onAjaxBeforeCalled = true;
        },
        onAjaxAfter : function(event) { 
          return (false);
        }
      };
      spyOn(callback, 'onAjaxBefore').andCallThrough();
      spyOn(callback, 'onAjaxAfter').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:before', callback.onAjaxBefore);
        form.on('ajax:after', callback.onAjaxAfter);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxBeforeCalled)});
      runs(function() {
        expect(callback.onAjaxAfter).wasNotCalled();
      });
    });
  });

  describe("when ajax request is successful", function() {
    it("executes before callback", function() {
      var callback = {
        onAjaxBeforeCalled: false,
        onAjaxBefore : function(event) {
          callback.onAjaxBeforeCalled = true;
        }
      };
      spyOn(callback, 'onAjaxBefore').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:before', callback.onAjaxBefore);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxBeforeCalled)});
      runs(function() {
        expect(callback.onAjaxBefore).toHaveBeenCalled();
      });
    });

    it("executes success callback", function() {
      var callback = {
        onAjaxSuccessCalled: false,
        onAjaxSuccess : function(event) {
          callback.onAjaxSuccessCalled = true;
        }
      };
      spyOn(callback, 'onAjaxSuccess').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:success', callback.onAjaxSuccess);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxSuccessCalled)});
      runs(function() {
        expect(callback.onAjaxSuccess).toHaveBeenCalled();
      });
    });

    it("executes complete callback", function() {
      var callback = {
        onAjaxCompleteCalled: false,
        onAjaxComplete : function(event) {
          callback.onAjaxCompleteCalled = true;
        }
      };
      spyOn(callback, 'onAjaxComplete').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:complete', callback.onAjaxComplete);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxCompleteCalled)});
      runs(function() {
        expect(callback.onAjaxComplete).toHaveBeenCalled();
      });
    });

    it("executes after callback", function() {
      var callback = {
        onAjaxAfterCalled: false,
        onAjaxAfter : function(event) {
          callback.onAjaxAfterCalled = true;
        }
      };
      spyOn(callback, 'onAjaxAfter').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:after', callback.onAjaxAfter);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxAfterCalled)});
      runs(function() {
        expect(callback.onAjaxAfter).toHaveBeenCalled();
      });
    });
  });

  describe("When ajax request fail", function() {
    beforeEach(function() {
      Ext.select("form").set({'action': App.url('error')});
    });

    it("executes before callback", function() {
      var callback = {
        onAjaxBeforeCalled: false,
        onAjaxBefore : function(event) {
          callback.onAjaxBeforeCalled = true;
        }
      };
      spyOn(callback, 'onAjaxBefore').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:before', callback.onAjaxBefore);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxBeforeCalled)});
      runs(function() {
        expect(callback.onAjaxBefore).toHaveBeenCalled();
      });
    });

    it("executes failure callback", function() {
      var callback = {
        onAjaxFailureCalled: false,
        onAjaxFailure : function(event) {
          callback.onAjaxFailureCalled = true;
        }
      };
      spyOn(callback, 'onAjaxFailure').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:failure', callback.onAjaxFailure);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxFailureCalled)});
      runs(function() {
        expect(callback.onAjaxFailure).toHaveBeenCalled();
      });
    });

    it("executes complete callback", function() {
      var callback = {
        onAjaxCompleteCalled: false,
        onAjaxComplete : function(event) {
          callback.onAjaxCompleteCalled = true;
        }
      };
      spyOn(callback, 'onAjaxComplete').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:complete', callback.onAjaxComplete);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxCompleteCalled)});
      runs(function() {
        expect(callback.onAjaxComplete).toHaveBeenCalled();
      });
    });

    it("executes after callback", function() {
      var callback = {
        onAjaxAfterCalled: false,
        onAjaxAfter : function(event) {
          callback.onAjaxAfterCalled = true;
        }
      };
      spyOn(callback, 'onAjaxAfter').andCallThrough();

      runs(function() {
        form = Ext.select("form");
        form.on('ajax:after', callback.onAjaxAfter);
        form.fireEvent('submit');
      });
      waitsFor(function() {return(callback.onAjaxAfterCalled)});
      runs(function() {
        expect(callback.onAjaxAfter).toHaveBeenCalled();
      });
    });
  });
});
