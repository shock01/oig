## OIG

[![Build Status](https://travis-ci.org/shock01/oig.svg?branch=master)](https://travis-ci.org/shock01/oig)

- Just a small framework for dependency injection, MVVM etc.
- Trying out and playing around with es6

## Code Style
- Use JSDoc comments on prototypes
```
/**
* @constructor
* @param {String} name
*/
function Klazz(name) {

}
```
- Use inline JSDoc comment on methods. And place @throws when throwing on method comment

```
/**
* @throws IllegalArgument
*/
function stringToLower(/**String*/value) /**String*/ {
  if(value === void 0) {
    throw 'IllegalArgument';
  }
  return value.toLowerCase();
}
```

The MIT License
===============

Copyright (c) 2015 Stef Hock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
