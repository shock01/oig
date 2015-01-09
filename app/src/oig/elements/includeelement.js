var oig;
(function (oig) {
  'use strict';
  var elements;
  (function (elements) {
    /**
     *
     * Based on http://www.w3.org/TR/xinclude/
     *
     * Attributes
     * <b>href</b>
     *  A value which, after appropriate escaping has been performed, results in a URI reference or an IRI reference specifying the location of the resource to include.
     *  The href attribute is optional; the absence of this attribute is the same as specifying href="", that is, the reference is to the same document.
     *  If the href attribute is absent when parse="xml", the xpointer attribute must be present.
     *  Fragment identifiers must not be used; their appearance is a fatal error.
     *  A value that results in a syntactically invalid URI or IRI should be reported as a fatal error,
     *  but some implementations may find it impractical to distinguish this case from a resource error.
     *
     * <b>xpointer</b>
     *  When parse="xml" or "html", the XPointer contained in the xpointer attribute is evaluated to identify a portion of the resource to include.
     *  This attribute is optional; when omitted, the entire resource is included. The xpointer attribute must not be present when parse="text".
     *  If the xpointer attribute is absent, the href attribute must be present.
     *
     * <b>parse</b>
     *    Indicates whether to include the resource as parsed XML or as text.
     *    The parse attribute allows XInclude to give the author of the including document priority over the server of the included document
     *    in terms of how to process the included content.
     *    A value of "html" indicates that the resource must be parsed as HTML(5)
     *    A value of "xml" indicates that the resource must be parsed as XML and the infosets merged.
     *    value of "text" indicates that the resource must be included as the character information items.
     *    This attribute is optional. When omitted, the value of "html" is implied (even in the absence of a default value declaration).
     *    Values other than "xml", "html" and "text" are a fatal error.
     *
     *
     * Fallback element
     *  The fallback element appears as a child of an xi:include element.
     *  It provides a mechanism for recovering from missing resources.
     *  When a resource error is encountered, the include element is replaced with the contents of the xi:fallback element.
     *  If the fallback element is empty, the include element is removed from the result.
     *  If the fallback element is missing, a resource error results in a fatal error.
     *
     *
     * Include element will be replaced by the contents of the included file
     * If an error occurs the fallback element will be shown
     *
     * Inclusion of SVG content need to make sure to set the namespace on the SVGSVGElement (http://www.w3.org/2000/svg)
     *
     * @type {HTMLElement}
     * @lends {HTMLElement.prototype}
     */
    var IncludeElement = Object.create(HTMLDivElement.prototype, {
      /**
       */
      attachedCallback: {
        value: function () {
          var element = this,
            href = this.getAttribute('href'),
            parse = this.getAttribute('parse') || 'html',
            xpointer = this.getAttribute('xpointer'),
            url;

          if ((href === null || href === '') && (xpointer === null || xpointer === '')) {
            throw '[oig:include] both href and xpointer attributes are absent';
          }

          if (typeof parse === 'string' && !(parse === 'text' || parse === 'xml' || parse === 'html')) {
            throw '[oig:include] parse attribute needs to be text or xml';
          }

          if (typeof xpointer === 'string' && parse === 'text') {
            throw '[oig:include] xpointer cannot be used when parse is text';
          }

          url = typeof href === 'string' ? href : this.ownerDocument.documentURI;
          var resource = oig.resource(url);

          resource.load()
            .then(function (text) {
              var /**@type Node*/node,
                /**@type DOMDocument*/doc;
              try {
                if (parse === 'text') {
                  node = element.ownerDocument.createTextNode(text);
                } else {
                  doc = new DOMParser().parseFromString(text, 'text/' + parse);
                  node = element.ownerDocument.importNode(parse === 'html' ? doc.body : doc.documentElement, true);
                  if (xpointer) {
                    var frag = element.ownerDocument.createDocumentFragment(),
                      xPathResult = element.ownerDocument.evaluate(xpointer, node, null, XPathResult.ANY_TYPE, null),
                      found = [],
                      next;
                    while (xPathResult && (next = xPathResult.iterateNext())) {
                      found.push(next);
                    }
                    found.forEach(function (/**Node*/node) {
                      frag.appendChild(element.ownerDocument.importNode(node.cloneNode(true), true));
                    });
                    node = frag;
                  }
                }
                element.parentNode.replaceChild(node, element);
              } catch (e) {
                console.error(e);
                throw e;
              }
            },
            function () {

            });
        }
      }
    });
    /**
     * registration
     */
    elements.IncludeElement = document.registerElement('oig-include', {
      prototype: IncludeElement
    });
  })/* jshint ignore:start */(elements = oig.elements || (oig.elements = {})/* jshint ignore:end */);
})/* jshint ignore:start */(oig || (oig = {})/* jshint ignore:end */);
