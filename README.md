# Mockumentary

Mockumentary is a library for creating mock objects from scratch using a
concise syntax.

## Creating a new mock class

    var Mock = new Mockumentary({
        foo: ()=> true,
        bar: false,
    })

The new `Mock` class has a method `foo` that will always return true and a
property `bar` with the value false.

## Instantiating a mock object

    var mock = new Mock()

The new `mock` object has a method `foo` and a property `bar` because it does
not add to or override the default `Mock` specification.

    var mock = new Mock({
        bam: function () {
            return true
        }
    })

This new `mock` object has a method `bam` that is a custom function which will
be set as the value for mock.bam.

## Specifying multiple return values

    var mock = new Mock({
        foo: ()=> [
            true,
            true,
            false,
        ],
    })

When an array of values is specified then calls to foo will return each value
in order. If the number of calls exceeds the length of the list then it will
start over at the first element.

## Specifying multiple custom methods

    var mock = new Mock({
        bam: ()=> [
            ()=> true,
            ()=> true,
            ()=> false,
        ]
    })

Mockumentary treats plain functions as regular values and uses arrow functions
to specify functions that should be called.

When `bam` is called the arrow function will be called with the original
arguments for `bam` and its return value will be returned.