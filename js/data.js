/**
 * Created by Maddy on 10/23/2015.
 */
Parse.initialize("APPLICATION_ID", "JAVASCRIPT_KEY");

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}, {
    success: function(object) {
        $(".success").show();
    },
    error: function(model, error) {
        $(".error").show();
    }
});


var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"});
