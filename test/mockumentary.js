'use strict'

const assert = require('chai').assert
const Mockumentary = require('../lib/mockumentary')

describe('mockumentary', function () {

    it('should allow creating new mock factory', function () {
        // create new mock factory with no defaults
        var FooMock = new Mockumentary()
        // should return constructor
        assert.isFunction(FooMock)
        // create new mock with default (none) properties
        var fooMock = new FooMock()
        // should return empty object
        assert.deepEqual(fooMock, {})
    })

    it('should allow specifying default methods that always return the same value', function () {
        // create new mock factory with two default methods, foo and bar,
        // that return true and false every time they are called.
        var FooMock = new Mockumentary({
            bar: ()=> false,
            foo: ()=> true,
        })
        // create new mock with default properties
        var fooMock = new FooMock()
        // call each method multiple times, should return same value
        for (var i=0; i < 3; i++) {
            assert.strictEqual(fooMock.bar(), false, 'loop '+i)
            assert.strictEqual(fooMock.foo(), true, 'loop '+i)
        }
    })

    it('should allow specifying default methods and properties', function () {
        // create new mock factory with a default method foo and a default property bar
        // and a custom method bam
        var FooMock = new Mockumentary({
            bam: function () {return true},
            bar: false,
            foo: ()=> true,
        })
        // create new mock with default properties
        var fooMock = new FooMock()
        // check property value
        assert.strictEqual(fooMock.bar, false)
        // call each method multiple times, should return same value
        for (var i=0; i < 3; i++) {
            assert.strictEqual(fooMock.bam(), true, 'loop '+i)
            assert.strictEqual(fooMock.foo(), true, 'loop '+i)
        }
    })

    it('should allow specifying default methods with mutliple return values', function () {
        // create new mock factory with a default method foo that returns multiple values
        var FooMock = new Mockumentary({
            foo: ()=> [true, false, null, undefined, 0, 1, [1,2], {foo: 'bar'}, function () {return true}],
        })
        // create new mock with default properties
        var fooMock = new FooMock()
        // call foo multiple times in loop - should return different value each time
        // then reset to first value
        for (var i=0; i < 3; i++) {
            assert.strictEqual(fooMock.foo(), true, 'loop '+i)
            assert.strictEqual(fooMock.foo(), false, 'loop '+i)
            assert.strictEqual(fooMock.foo(), null, 'loop '+i)
            assert.strictEqual(fooMock.foo(), undefined, 'loop '+i)
            assert.strictEqual(fooMock.foo(), 0, 'loop '+i)
            assert.strictEqual(fooMock.foo(), 1, 'loop '+i)
            assert.deepEqual(fooMock.foo(), [1,2], 'loop '+i)
            assert.deepEqual(fooMock.foo(), {foo: 'bar'}, 'loop '+i)
            assert.isFunction(fooMock.foo(), 'loop '+i)
        }
    })

    it('should allow overriding default values for each mock instance', function () {
        // create new mock factory with two default methods, foo and bar,
        // that return true and false every time they are called.
        var FooMock = new Mockumentary({
            bar: ()=> false,
            foo: ()=> true,
        })
        // create new mock with bar overridden
        var fooMock = new FooMock({
            bar: ()=> true,
        })
        // check that override method has correct value
        assert.strictEqual(fooMock.bar(), true)
        // check that default method has correct value
        assert.strictEqual(fooMock.foo(), true)
    })

    it('should allow specifying multiple custom functions that are called in order', function () {
        // create new mock factory with a default method foo that returns multiple values
        var FooMock = new Mockumentary({
            foo: ()=> [
                (x, y) => {
                    // validate args
                    assert.strictEqual(x, 0)
                    assert.strictEqual(y, 1)
                    // return false on first call
                    return false
                },
                (x, y) => {
                    // validate args
                    assert.strictEqual(x, 0)
                    assert.strictEqual(y, 1)
                    // return true on second call
                    return true
                }
            ],
        })
        // create new mock with default properties
        var fooMock = new FooMock()
        // call foo multiple times in loop - should return different value each time
        // then reset to first value
        for (var i=0; i < 3; i++) {
            assert.strictEqual(fooMock.foo(0, 1), false, 'loop '+i)
            assert.strictEqual(fooMock.foo(0, 1), true, 'loop '+i)
        }
    })

})