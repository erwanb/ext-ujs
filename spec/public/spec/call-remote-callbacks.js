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
    it("executes before callback", executeCallbackOnFormSubmission.createCallback('ajax:before'));
    it("executes success callback", executeCallbackOnFormSubmission.createCallback('ajax:success'));
    it("executes complete callback", executeCallbackOnFormSubmission.createCallback('ajax:complete'));
    it("executes after callback", executeCallbackOnFormSubmission.createCallback('ajax:after'));
  });

  describe("When ajax request fail", function() {
    beforeEach(function() {
      Ext.select("form").set({'action': App.url('error')});
    });

    it("executes before callback", executeCallbackOnFormSubmission.createCallback('ajax:before'));
    it("executes failure callback", executeCallbackOnFormSubmission.createCallback('ajax:failure'));
    it("executes complete callback", executeCallbackOnFormSubmission.createCallback('ajax:complete'));
    it("executes after callback", executeCallbackOnFormSubmission.createCallback('ajax:after'));
  });
});

function executeCallbackOnFormSubmission(eventName) {
  var callback = {
    onCallbackCalled: false,
    onCallback : function(event) {
      callback.onCallbackCalled = true;
    }
  };
  spyOn(callback, 'onCallback').andCallThrough();
  
  runs(function() {
    form = Ext.select("form");
    form.on(eventName, callback.onCallback);
    form.fireEvent('submit');
  });
  waitsFor(function() {return(callback.onCallbackCalled)});
  runs(function() {
    expect(callback.onCallback).toHaveBeenCalled();
  });
}