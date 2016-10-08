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
 * foo: true - will always return true when foo is called
 * foo: [true, false] - returns true, false, true, false ...
 *
 * mock properties are specified by providing a function that returns the
 * property value.
 *
 * bar: ()=> true - has a property that is true
 * bar: function () {return true} - property is a function that returns true
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
    // if configuration value is a function then call function to get property
    if (typeof val === 'function') {
        // check if this is regular or arrow function
        return val.toString().match(/^\s*function/)
            // if this is regular function then use this as value
            ? val
            // if it is arrow function then use returned value as value
            : val()
    }
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
        // return values for method in order
        return val[callIndex++]
    }
}