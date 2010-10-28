describe('data-method', function() {
  describe("When a link with a data-method attribute is clicked", function() {
    it("send request with method specified by data-method attribute",
       sendRequestAndExpect.createCallback("fixtures-iframe","/delete was invoked with delete verb. params is {\"_method\"=&gt;\"delete\"}"));

    describe("When csrf token is present", function() {
      it("send request with csrf token", sendRequestAndExpect.createCallback('fixtures-iframe-csrf', "/delete was invoked with delete verb. params is {\"_method\"=&gt;\"delete\", \"authenticity_token\"=&gt;\"cf50faa3fe97702ca1ae\"}"));
    });
  });
});

function sendRequestAndExpect(selector, expectedContent) {
  iframe = Ext.get(selector).down('iframe');
  
  iframeCallback = function() {
		var data = iframe.dom.contentDocument.body.innerHTML;
		expect(data).toEqual(expectedContent);
	};
  
	//Nothing to do. Just wait for iframe to load and do its thing. And then verify
  if(iframe.dom.loaded) {
    iframeCallback();
  } else {
    iframe.on("load", iframeCallback);
  }
}