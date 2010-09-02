Ext.override(Ext.CompositeElementLite, {
  fireEvent: function(event) {
    this.invoke("fireEvent", arguments);
  }
});