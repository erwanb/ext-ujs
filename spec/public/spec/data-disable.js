describe('data-disable', function() {
  var fixtures;

  beforeEach(function() {
    fixtures = Ext.get('fixtures');
  });
  
  afterEach(function() {
    fixtures.update('');
  });

  describe('When triggering ajax callbacks on a form with data-disable attribute', function() {
    beforeEach(function() {
      Ext.DomHelper.append(fixtures, {
        tag           : 'form',
        'data-remote' : 'true',
        method        : 'post',
        action        : App.url('update'),
        cn            : [{
          tag                : 'input',
          id                 : 'user_name',
			    'data-disable-with': 'processing ...',
			    type               :  'text',
			    size               : '30',
			    name               : 'user_name',
			    value              : 'john'
        }]
      });
    });

    it("disable inputs until ajax request is completed", function() {
      expect(Ext.select('input[disabled]').getCount()).toEqual(0);
	    expect(Ext.fly('user_name').getValue()).toEqual('john');
      
	    Ext.select('form').fireEvent('submit');
      
      expect(Ext.select('input[disabled]').getCount()).toEqual(1);
	    expect(Ext.select('input[disabled]').item(0).getValue()).toEqual('processing ...');

	    Ext.select('form').fireEvent('ajax:complete');

      expect(Ext.select('input[disabled]').getCount()).toEqual(0);
	    expect(Ext.select('input').item(0).getValue()).toEqual('john');
    });
  });

  describe('When clicking on non-ajax Submit input tag with data-disable-with attribute', function() {
    beforeEach(function() {
      Ext.DomHelper.append(fixtures, {
        tag   : 'form',
        method: 'post',
        action: App.url('update'),
        cn    : [{
          tag                : 'input',
          id                 : 'submit',
			    'data-disable-with': 'submitting ...',
			    type               : 'submit',
			    name               : 'submit',
			    value              : 'Submit'
        }]
      });
    });

    it("disable inputs", function() {
      expect(Ext.select('input[disabled]').getCount()).toEqual(0);
 	    expect(Ext.fly('submit').getValue()).toEqual('Submit');
      
 	    Ext.select('form').on('submit', function (event, element) {
 		    event.preventDefault();
 	    });
      Ext.select('form').fireEvent('submit');
      
      expect(Ext.select('input[disabled]').getCount()).toEqual(1);
	    expect(Ext.select('input[disabled]').item(0).getValue()).toEqual('submitting ...');      
    });
  });
});
