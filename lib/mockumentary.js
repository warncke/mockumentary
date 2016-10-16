'use strict'

/* npm modules */
var _ = require('lodash')

/* exports */
module.exports = Mockumentary

/**
 * @function Mockumentary
 *
 * instantiates new mock factory class that must be called in turn with new to
 * instantiate a mock instace.
 *
 * both this constructor and the constructor it creates accept the same types
 * of arguments. the arguments to this constructor provide the default methods
 * and properties for the mock object while each mock instance can be called
 * with arguments that override the defaults.
 *
 * mock methods are specified with the method name and a value to be returned
 * when the method is called.
 *
 * mock methods that use Mockumentary's method generator use arrow functions.
 *
 * foo: ()=> true - will always return true when foo is called
 * foo: ()=> [true, false] - returns true, false, true, false ...
 *
 * custom mock methods must be specified with classic functions.
 *
 * foo: function () {return true} - custom method that returns true
 *
 * mock properties are specified by providing the value for the property.
 *
 * foo: 'bar' - property with value 'bar'
 *
 * @param {object} defaults
 *
 * @returns {Mockumentary}
 */
function Mockumentary (defaults) {
    // return new mock factory constructor
    return function (args) {
        return buildMock(defaults, args)
    }
}

/* private functions */


/**
 * @function buildMock
 *
 * construct mock object from default and custom properties
 *
 * @param 
 *
 */
function buildMock (defaults, args) {
    // mock object to be build
    var mock = {}
    // iterate over defaults
    _.each(defaults, (val, key) => {
        mock[key] = buildMockAttribute(val)
    })
    // iterate over args, overriding defaults
    _.each(args, (val, key) => {
        mock[key] = buildMockAttribute(val)
    })
    // return mock object
    return mock
}

/**
 * @function buildMockAttribute
 *
 * create the correct mock method or property based on the configuration
 * value
 *
 * @param {*} val
 *
 * @returns {*}
 */

function buildMockAttribute (val) {
    // if value is not a function then this is a property not a method
    // if value is a regular function then it is a custom method
    if (typeof val !== 'function' || val.toString().match(/^\s*function/)) {
        return val
    }
    // if value is an arrow function then the value return by this function
    // is the value to be returned by the mock method
    else {
        // get actual value by calling function
        val = val()
        // if value is anything other than array then convert it to first element
        // of single element array so that it will always be returned when the
        // method is called
        if (!Array.isArray(val)) {
            val = [val]
        }
        // counter to keep track of how many times method has been called
        var callIndex = 0
        // return new method for object
        return function () {
            // loop through list of values on multiple calls
            if (callIndex > val.length - 1) {
                callIndex = 0
            }
            // get the next value and increment index
            var ret = val[callIndex++]
            // if value is a plain function or not a function then return it
            if (typeof ret !== 'function' || ret.toString().match(/^\s*function/)) {
                return ret
            }
            // otherwise val is an arrow function - call with original args
            else {
                return ret.apply(this, arguments)
            }
        }
    }
}