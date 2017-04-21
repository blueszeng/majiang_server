"use strict";
var chai = require('chai');
chai.should();
var app;
describe('test search mysqldb', function(){
  before(function() {
     app = {
      mysqlConfig : require('../shared/config/mysql.json'),
      get: function() {
        return this.mysqlConfig;
      }
    };
  });
  it('search test', function(done) {
    var db = require('../app/daos/mysql').init(app);
    db.query("select * from users", [])
    .then(function(value) {
      value[0].id.should.equal(1);
      done();
    });
  });
});
