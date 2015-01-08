## OIG 

DISCLAIMER: Documentation is really not finished yet!!! 

Meanwhile......just look at the demo. (Chrome latest or any updated evergreen webkit like browser)
[Demo](http://shock01.github.io/oig/index.html)

> A simple MVVM based implementation using evergreen features like Custom Elements, DOM Level 4 
(Work in Chrome, Opera latest also works).
> Run it like: 
  1) npm install 
  2) gulp serve

## Defining viewModels

------------------------------------------------------------------------------------------------------------------------

ViewModels will be referred to as 'dataContext' when used in elements and/or views.

### Simple viewModels
      // viewModel as object literal
      var mainViewModel = {
        name: 'Hello',
        cta: function () {
        }
      };
      
      Object.defineProperty(oig.viewModels, 'main', {
        value: mainViewModel
      });
      
      // or simply
      
      oig.viewModels.main = mainViewModel

### Prototype viewModels

Using Object.defineProperty a getter can be added for each viewModel. Inside the getter any resource injection may occur.
Also preserving viewModels or constructing new instances of a viewModel can be done in the getters

      // viewModel as prototype
      function MainViewModel() {
      }

      Object.defineProperty(oig.viewModels, 'main', {
        get: function () {
          // pass prototype constructor arguments here
          return new MainViewModel();
        }
      });

------------------------------------------------------------------------------------------------------------------------

## Context Element

------------------------------------------------------------------------------------------------------------------------

The context element is used to add a dataContext to the view. Lookup is done by name.
The context will only be available to elements that actually use it. Eg. all OIG Elements 
will have a getter for dataContext

      <div is="oig-context" data-view-model="main"

Manually resolving the current dataContext of an element.
Using script custom elements or javascript can access the current viewModel

      var element = document.getElementById(....);
      var dataContext = oig.dataContext(element);

### Custom Events

Will dispatch onviewload when attached to DOM
Will dispatch onviewunload when detached from DOM.

Both events inherit from CustomEvent and are not cancellable and do not bubble.

### Lifecycle callbacks

      var viewModel = {
        onload: function () {},
        onunload: function () {}
      }

When onload is defined on viewModel then onload method is called before dispatching onviewload event
When onunload is defined on viewModel then onunload method is called before dispatching onviewunload event


------------------------------------------------------------------------------------------------------------------------

## If Element

------------------------------------------------------------------------------------------------------------------------

Elements can be conditionally rendered using oig-if element. When an element is not rendered it will be wrapped in a comment

      <oig-if test="flag"><template>Show me when true</template></oig-if>

- attributes
     * test - expression that will be evaluated. When result is thruthy evaluate as true, when falsly evaluate as false



   


------------------------------------------------------------------------------------------------------------------------

## Include Element

------------------------------------------------------------------------------------------------------------------------

The include element can be used to include partial views. 
Content can be included as html,text or xml. By default content will be included as html.

XPointer attribute can be used for including specific content. 
When attribute parse is text it will throw exception.

Alternate content can be included to show up when an error occurs including the content. (TODO)

      <oig-include href="myfile.html" xpointer="//div" parse="html"/>
      <oig-include href="myfile.html" parse="text"/>


------------------------------------------------------------------------------------------------------------------------

## Listener Element

------------------------------------------------------------------------------------------------------------------------

Event listeners are defined on a custom element named 'oig-listener'. 
Multiple events can be listened to by 'on' attribute on the listener element.

- attributes
     * on<eventType> - required attribute value is parsed and executed on current dataContext, multiple events can be specified on a single element
     * target - optional attribute to specify the domId of the element that should equal the event target
     * prevent-default - optional attribute to prevent default event action
     * stop-progagation - optional attribute to stop propagation of event
     * selector - optional attribute to select sibling of event target on which listener should be invoked

The listener element event callbacks will be executed on the closest available dataContext.

NB. Elements needs to have a closing tag otherwise event propagation will not work



     <div is="oig-context" data-view-model="main">
       <!-- listener -->
       <oig-listener onclick="cta(name)"></oig-listener>
       <!-- content -->
       <button>Hello world</button>
     </div>


------------------------------------------------------------------------------------------------------------------------

## Binding Element

------------------------------------------------------------------------------------------------------------------------

Databinding can be set on specific targets. This is because some HTMLElements do not allow any contents. eg IMG
By default databinding is one-way. To use bidirectional binding please look at the Bidirectional Element.

Binding expression are evaluated as regular javascript expressions. This means that strings needs to be enclosed with quotes.
Eg. style="color:red" will not work and needs be written as style="'color:red'"

Attribute binding is also namespace aware so any attributes added to the binding element will update the bound element
with the proper namespace.
Eg. <oig-binding xlink:href=""> will use the xlink namespace declared in the owner document.

### Two way databinding. ()
Seen as an anti-pattern by some. (One way data flow as described by eg. ReactJS) 
Most of the times it's not needed to have 2way databinding. Most common use case is forms.
Will be added in the future

### Bind once
when adding the attribute 'once' to the binding the binding will be only evaluated once and will not reflect the changes made to the viewModel
      <oig-binding title="myTitleProperty" once></oig-binding>

### Updating textContent binding expression

Updating the binding expression used for setting the textContent on the shadowRoot


      oig.viewModels.main = {
        name: 'John'
      }
      
      <div is="oig-context" data-view-model="main">
        <oig-binding width="width" oig-data-target="nextSibling">
        <img/>
      </div>
      
      document.querySelector('oig-binding').textContent = 'Hello ' + name + '!';


### Updating attribute bindings

      oig.viewModels.main = {
        width: 100
      }
      
      <div is="oig-context" data-view-model="main">
        <oig-binding width="width" oig-data-target="nextSibling" style="'color:red'">
        <img/>
      </div>
      
      document.querySelector('oig-binding').setAttribute("width", "width / 2")
      document.querySelector('oig-binding').setAttribute("style", "'color:blue'")


The MIT License
===============

Copyright (c) 2014 Stef Hock

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



