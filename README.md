## OIG


DISCLAIMER: Documentation is really not finished yet!!!

# Currently migrating from oig repo to oig-mvvm!!!!!



> A simple MVVM based framework with DI and fancy stuff like that).
> Run it like:
  1) npm install
  2) gulp serve

## Defining viewModels

------------------------------------------------------------------------------------------------------------------------

ViewModels will be referred to as 'dataContext' when used in elements and/or views.
ViewModels can be registered as Singleton(Default) or as new.
When registering as new it will create a new instance per context


### Registration
      function ViewModel() {
        this.name = 'I am a templated viewModel';
        this.items = [{id: 0, name: "John Doe"}, {id: 1, name: "Jane Doe"}];
      }

      oig.bind('template').to(ViewModel).asNew();



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
