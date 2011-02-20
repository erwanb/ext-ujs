// Some hacks pass specs with ext3.x and ext4
  
if (Function.prototype.createCallback === undefined) {
  Function.prototype.createCallback = function(args) {
    return (Ext.pass(this, arguments));
  };
}

if (Ext.core === undefined) {
  Ext.core = Ext;
}
