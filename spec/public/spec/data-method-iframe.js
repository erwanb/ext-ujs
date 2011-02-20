Ext.onReady(function() {
  Ext.core.DomHelper.append(Ext.get('fixtures-iframe'), {
    tag          : 'a',
    href         : App.url('delete'),
    'data-method': 'delete',
    text         : 'Destroy',
    html         : "test"
  });
  Ext.select('a[data-method]').fireEvent('click');
});
