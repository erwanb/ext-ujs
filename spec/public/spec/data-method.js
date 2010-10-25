describe('data-method', function() {
  describe("When a link with a data-method attribute is clicked", function() {
    it("send request with method specified by data-method attribute", function() {
      iframe = Ext.get('fixtures-iframe').down('iframe');

      iframeCallback = function() {
		    var data = iframe.dom.contentDocument.body.innerHTML;
		    expect(data).toEqual("/delete was invoked with delete verb. params is {\"_method\"=&gt;\"delete\"}");
	    };

	    //Nothing to do. Just wait for iframe to load and do its thing. And then verify
      if(iframe.dom.loaded) {
        iframeCallback();
      } else {
        iframe.on("load", iframeCallback);
      }
    });

    describe("When csrf token is present", function() {
      it("send request with csrf token", function() {
        iframe = Ext.get('fixtures-iframe-csrf').down('iframe');

        iframeCallback = function() {
		      var data = iframe.dom.contentDocument.body.innerHTML;
		      expect(data).toEqual("/delete was invoked with delete verb. params is {\"_method\"=&gt;\"delete\", \"authenticity_token\"=&gt;\"cf50faa3fe97702ca1ae\"}");
	      };

	      //Nothing to do. Just wait for iframe to load and do its thing. And then verify
        if(iframe.dom.loaded) {
          iframeCallback();
        } else {
          iframe.on("load", iframeCallback);
        }
      });
    });
  });
});

// test('clicking on a link with data-method attribute and csrf', function() {
// 	expect(1);
// 	stop(App.ajax_timeout);

//   var iframe = $('#fixtures-iframe-csrf iframe');

//   var iframeCallback = function() {
// 		var data = iframe.contents().find('body').text();
// 		equals(data, "/delete was invoked with delete verb. params is {\"_method\"=>\"delete\", \"authenticity_token\"=>\"cf50faa3fe97702ca1ae\"}", 
//                  'iframe should be proper response message');

// 		start();
//   };

// 	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
//   if(iframe[0].loaded) {
//     iframeCallback();
//   } else {
//     iframe.live("load", iframeCallback);
//   }
// });
