if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var g,aa=this;function ba(a,b){var c=a.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}
function p(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}var ca="closure_uid_"+(1E9*Math.random()>>>0),da=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ha(a,b,c){ha=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ha.apply(null,arguments)};function ia(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ja(a,b){null!=a&&this.append.apply(this,arguments)}g=ja.prototype;g.$a="";g.set=function(a){this.$a=""+a};g.append=function(a,b,c){this.$a+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.$a+=arguments[d];return this};g.clear=function(){this.$a=""};g.toString=function(){return this.$a};function ka(a,b){a.sort(b||la)}function ma(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||la;ka(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function la(a,b){return a>b?1:a<b?-1:0};var na;if("undefined"===typeof oa)var oa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ra)var ra=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var sa=!0,ta=null;if("undefined"===typeof ua)var ua=null;function va(){return new t(null,5,[ya,!0,za,!0,Aa,!1,Ba,!1,Ca,null],null)}Da;function v(a){return null!=a&&!1!==a}Ea;w;function Fa(a){return null==a}function Ga(a){return a instanceof Array}
function Ha(a){return null==a?!0:!1===a?!0:!1}function x(a,b){return a[p(null==b?null:b)]?!0:a._?!0:!1}function y(a,b){var c=null==b?null:b.constructor,c=v(v(c)?c.ub:c)?c.cb:p(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ia(a){var b=a.cb;return v(b)?b:""+A(a)}var Ka="undefined"!==typeof Symbol&&"function"===p(Symbol)?Symbol.iterator:"@@iterator";function La(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}C;Ma;
var Da=function Da(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Da.a(arguments[0]);case 2:return Da.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Da.a=function(a){return Da.b(null,a)};Da.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ma.c?Ma.c(c,d,b):Ma.call(null,c,d,b)};Da.u=2;function Na(){}
var Oa=function Oa(b){if(null!=b&&null!=b.X)return b.X(b);var c=Oa[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Oa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("ICounted.-count",b);},Pa=function Pa(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Pa[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IEmptyableCollection.-empty",b);};function Qa(){}
var Ta=function Ta(b,c){if(null!=b&&null!=b.W)return b.W(b,c);var d=Ta[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ta._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("ICollection.-conj",b);};function Ua(){}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.b(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
D.b=function(a,b){if(null!=a&&null!=a.T)return a.T(a,b);var c=D[p(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=D._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw y("IIndexed.-nth",a);};D.c=function(a,b,c){if(null!=a&&null!=a.ka)return a.ka(a,b,c);var d=D[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=D._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw y("IIndexed.-nth",a);};D.u=3;function Va(){}
var Wa=function Wa(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Wa[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Wa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("ISeq.-first",b);},Xa=function Xa(b){if(null!=b&&null!=b.ea)return b.ea(b);var c=Xa[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Xa._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("ISeq.-rest",b);};function Za(){}function $a(){}
var ab=function ab(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ab.b(arguments[0],arguments[1]);case 3:return ab.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
ab.b=function(a,b){if(null!=a&&null!=a.K)return a.K(a,b);var c=ab[p(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=ab._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw y("ILookup.-lookup",a);};ab.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=ab[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=ab._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw y("ILookup.-lookup",a);};ab.u=3;
var bb=function bb(b,c){if(null!=b&&null!=b.Lb)return b.Lb(b,c);var d=bb[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=bb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IAssociative.-contains-key?",b);},db=function db(b,c,d){if(null!=b&&null!=b.Va)return b.Va(b,c,d);var e=db[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("IAssociative.-assoc",b);};function eb(){}
var gb=function gb(b,c){if(null!=b&&null!=b.Bb)return b.Bb(b,c);var d=gb[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=gb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IMap.-dissoc",b);};function hb(){}
var ib=function ib(b){if(null!=b&&null!=b.rb)return b.rb(b);var c=ib[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IMapEntry.-key",b);},jb=function jb(b){if(null!=b&&null!=b.sb)return b.sb(b);var c=jb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IMapEntry.-val",b);};function kb(){}
var lb=function lb(b,c){if(null!=b&&null!=b.Yb)return b.Yb(0,c);var d=lb[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=lb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("ISet.-disjoin",b);};function mb(){}
var nb=function nb(b,c,d){if(null!=b&&null!=b.bb)return b.bb(b,c,d);var e=nb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=nb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("IVector.-assoc-n",b);},ob=function ob(b){if(null!=b&&null!=b.qb)return b.qb(b);var c=ob[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IDeref.-deref",b);};function pb(){}
var qb=function qb(b){if(null!=b&&null!=b.N)return b.N(b);var c=qb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IMeta.-meta",b);},rb=function rb(b,c){if(null!=b&&null!=b.O)return b.O(b,c);var d=rb[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IWithMeta.-with-meta",b);};function sb(){}
var tb=function tb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return tb.b(arguments[0],arguments[1]);case 3:return tb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
tb.b=function(a,b){if(null!=a&&null!=a.$)return a.$(a,b);var c=tb[p(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=tb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw y("IReduce.-reduce",a);};tb.c=function(a,b,c){if(null!=a&&null!=a.aa)return a.aa(a,b,c);var d=tb[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=tb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw y("IReduce.-reduce",a);};tb.u=3;
var ub=function ub(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=ub[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ub._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IEquiv.-equiv",b);},vb=function vb(b){if(null!=b&&null!=b.P)return b.P(b);var c=vb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=vb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IHash.-hash",b);};function xb(){}
var yb=function yb(b){if(null!=b&&null!=b.V)return b.V(b);var c=yb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=yb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("ISeqable.-seq",b);};function zb(){}function Ab(){}function Bb(){}
var Cb=function Cb(b){if(null!=b&&null!=b.Db)return b.Db(b);var c=Cb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Cb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IReversible.-rseq",b);},Db=function Db(b,c){if(null!=b&&null!=b.ac)return b.ac(0,c);var d=Db[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IWriter.-write",b);},Eb=function Eb(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);var e=
Eb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Eb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("IPrintWithWriter.-pr-writer",b);},Fb=function Fb(b,c,d){if(null!=b&&null!=b.$b)return b.$b(0,c,d);var e=Fb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("IWatchable.-notify-watches",b);},Ib=function Ib(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=Ib[p(null==b?null:
b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IEditableCollection.-as-transient",b);},Jb=function Jb(b,c){if(null!=b&&null!=b.ab)return b.ab(b,c);var d=Jb[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Jb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("ITransientCollection.-conj!",b);},Kb=function Kb(b){if(null!=b&&null!=b.kb)return b.kb(b);var c=Kb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("ITransientCollection.-persistent!",b);},Lb=function Lb(b,c,d){if(null!=b&&null!=b.tb)return b.tb(b,c,d);var e=Lb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Lb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("ITransientAssociative.-assoc!",b);},Mb=function Mb(b,c,d){if(null!=b&&null!=b.Zb)return b.Zb(0,c,d);var e=Mb[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Mb._;
if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("ITransientVector.-assoc-n!",b);};function Nb(){}
var Ob=function Ob(b,c){if(null!=b&&null!=b.ib)return b.ib(b,c);var d=Ob[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ob._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IComparable.-compare",b);},Pb=function Pb(b){if(null!=b&&null!=b.Wb)return b.Wb();var c=Pb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IChunk.-drop-first",b);},Qb=function Qb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=
Qb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IChunkedSeq.-chunked-first",b);},Sb=function Sb(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=Sb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IChunkedSeq.-chunked-rest",b);},Tb=function Tb(b){if(null!=b&&null!=b.Mb)return b.Mb(b);var c=Tb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IChunkedNext.-chunked-next",b);},Ub=function Ub(b,c){if(null!=b&&null!=b.uc)return b.uc(b,c);var d=Ub[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ub._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("IReset.-reset!",b);},Vb=function Vb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Vb.b(arguments[0],arguments[1]);case 3:return Vb.c(arguments[0],
arguments[1],arguments[2]);case 4:return Vb.A(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Vb.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Vb.b=function(a,b){if(null!=a&&null!=a.wc)return a.wc(a,b);var c=Vb[p(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Vb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw y("ISwap.-swap!",a);};
Vb.c=function(a,b,c){if(null!=a&&null!=a.xc)return a.xc(a,b,c);var d=Vb[p(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Vb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw y("ISwap.-swap!",a);};Vb.A=function(a,b,c,d){if(null!=a&&null!=a.yc)return a.yc(a,b,c,d);var e=Vb[p(null==a?null:a)];if(null!=e)return e.A?e.A(a,b,c,d):e.call(null,a,b,c,d);e=Vb._;if(null!=e)return e.A?e.A(a,b,c,d):e.call(null,a,b,c,d);throw y("ISwap.-swap!",a);};
Vb.I=function(a,b,c,d,e){if(null!=a&&null!=a.zc)return a.zc(a,b,c,d,e);var f=Vb[p(null==a?null:a)];if(null!=f)return f.I?f.I(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Vb._;if(null!=f)return f.I?f.I(a,b,c,d,e):f.call(null,a,b,c,d,e);throw y("ISwap.-swap!",a);};Vb.u=5;var Wb=function Wb(b){if(null!=b&&null!=b.sa)return b.sa(b);var c=Wb[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Wb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IIterable.-iterator",b);};
function Xb(a){this.Kc=a;this.h=1073741824;this.w=0}Xb.prototype.ac=function(a,b){return this.Kc.append(b)};function Yb(a){var b=new ja;a.L(null,new Xb(b),va());return""+A(b)}var Zb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function $b(a){a=Zb(a|0,-862048943);return Zb(a<<15|a>>>-15,461845907)}
function ac(a,b){var c=(a|0)^(b|0);return Zb(c<<13|c>>>-13,5)+-430675100|0}function cc(a,b){var c=(a|0)^b,c=Zb(c^c>>>16,-2048144789),c=Zb(c^c>>>13,-1028477387);return c^c>>>16}function dc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=ac(c,$b(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^$b(a.charCodeAt(a.length-1)):b;return cc(b,Zb(2,a.length))}ec;F;I;fc;var gc={},hc=0;
function ic(a){255<hc&&(gc={},hc=0);var b=gc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Zb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;gc[a]=b;hc+=1}return a=b}function jc(a){null!=a&&(a.h&4194304||a.Oc)?a=a.P(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=ic(a),0!==a&&(a=$b(a),a=ac(0,a),a=cc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:vb(a);return a}
function kc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ea(a,b){return b instanceof a}function lc(a,b){if(a.Da===b.Da)return 0;var c=Ha(a.ha);if(v(c?b.ha:c))return-1;if(v(a.ha)){if(Ha(b.ha))return 1;c=la(a.ha,b.ha);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}J;function F(a,b,c,d,e){this.ha=a;this.name=b;this.Da=c;this.hb=d;this.ja=e;this.h=2154168321;this.w=4096}g=F.prototype;g.toString=function(){return this.Da};g.equiv=function(a){return this.v(null,a)};
g.v=function(a,b){return b instanceof F?this.Da===b.Da:!1};g.call=function(){function a(a,b,c){return J.c?J.c(b,this,c):J.call(null,b,this,c)}function b(a,b){return J.b?J.b(b,this):J.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};
g.a=function(a){return J.b?J.b(a,this):J.call(null,a,this)};g.b=function(a,b){return J.c?J.c(a,this,b):J.call(null,a,this,b)};g.N=function(){return this.ja};g.O=function(a,b){return new F(this.ha,this.name,this.Da,this.hb,b)};g.P=function(){var a=this.hb;return null!=a?a:this.hb=a=kc(dc(this.name),ic(this.ha))};g.L=function(a,b){return Db(b,this.Da)};
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};mc.a=function(a){if(a instanceof F)return a;var b=a.indexOf("/");return-1===b?mc.b(null,a):mc.b(a.substring(0,b),a.substring(b+1,a.length))};mc.b=function(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new F(a,b,c,null,null)};
mc.u=2;nc;oc;K;function L(a){if(null==a)return null;if(null!=a&&(a.h&8388608||a.vc))return a.V(null);if(Ga(a)||"string"===typeof a)return 0===a.length?null:new K(a,0);if(x(xb,a))return yb(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function M(a){if(null==a)return null;if(null!=a&&(a.h&64||a.ba))return a.Z(null);a=L(a);return null==a?null:Wa(a)}function N(a){return null!=a?null!=a&&(a.h&64||a.ba)?a.ea(null):(a=L(a))?Xa(a):O:O}
function P(a){return null==a?null:null!=a&&(a.h&128||a.Cb)?a.da(null):L(N(a))}var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return I.a(arguments[0]);case 2:return I.b(arguments[0],arguments[1]);default:return I.l(arguments[0],arguments[1],new K(c.slice(2),0))}};I.a=function(){return!0};I.b=function(a,b){return null==a?null==b:a===b||ub(a,b)};
I.l=function(a,b,c){for(;;)if(I.b(a,b))if(P(c))a=b,b=M(c),c=P(c);else return I.b(b,M(c));else return!1};I.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return I.l(b,a,c)};I.u=2;function pc(a){this.C=a}pc.prototype.next=function(){if(null!=this.C){var a=M(this.C);this.C=P(this.C);return{value:a,done:!1}}return{value:null,done:!0}};function qc(a){return new pc(L(a))}rc;function sc(a,b,c){this.value=a;this.nb=b;this.Jb=c;this.h=8388672;this.w=0}sc.prototype.V=function(){return this};sc.prototype.Z=function(){return this.value};
sc.prototype.ea=function(){null==this.Jb&&(this.Jb=rc.a?rc.a(this.nb):rc.call(null,this.nb));return this.Jb};function rc(a){var b=a.next();return v(b.done)?O:new sc(b.value,a,null)}function tc(a,b){var c=$b(a),c=ac(0,c);return cc(c,b)}function uc(a){var b=0,c=1;for(a=L(a);;)if(null!=a)b+=1,c=Zb(31,c)+jc(M(a))|0,a=P(a);else return tc(c,b)}var vc=tc(1,0);function wc(a){var b=0,c=0;for(a=L(a);;)if(null!=a)b+=1,c=c+jc(M(a))|0,a=P(a);else return tc(c,b)}var xc=tc(0,0);yc;ec;zc;Na["null"]=!0;
Oa["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.pb=!0;Date.prototype.ib=function(a,b){if(b instanceof Date)return la(this.valueOf(),b.valueOf());throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};ub.number=function(a,b){return a===b};Ac;pb["function"]=!0;qb["function"]=function(){return null};vb._=function(a){return a[ca]||(a[ca]=++da)};function Bc(a){return a+1}Cc;
function Dc(a){this.F=a;this.h=32768;this.w=0}Dc.prototype.qb=function(){return this.F};function Fc(a){return a instanceof Dc}function Cc(a){return ob(a)}function Gc(a,b){var c=Oa(a);if(0===c)return b.o?b.o():b.call(null);for(var d=D.b(a,0),e=1;;)if(e<c){var f=D.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Fc(d))return ob(d);e+=1}else return d}function Hc(a,b,c){var d=Oa(a),e=c;for(c=0;;)if(c<d){var f=D.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Fc(e))return ob(e);c+=1}else return e}
function Ic(a,b){var c=a.length;if(0===a.length)return b.o?b.o():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Fc(d))return ob(d);e+=1}else return d}function Jc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Fc(e))return ob(e);c+=1}else return e}function Kc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Fc(c))return ob(c);d+=1}else return c}Lc;Q;Mc;Nc;
function Oc(a){return null!=a?a.h&2||a.jc?!0:a.h?!1:x(Na,a):x(Na,a)}function Pc(a){return null!=a?a.h&16||a.Xb?!0:a.h?!1:x(Ua,a):x(Ua,a)}function Qc(a,b){this.f=a;this.i=b}Qc.prototype.fa=function(){return this.i<this.f.length};Qc.prototype.next=function(){var a=this.f[this.i];this.i+=1;return a};function K(a,b){this.f=a;this.i=b;this.h=166199550;this.w=8192}g=K.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};
g.T=function(a,b){var c=b+this.i;return c<this.f.length?this.f[c]:null};g.ka=function(a,b,c){a=b+this.i;return a<this.f.length?this.f[a]:c};g.sa=function(){return new Qc(this.f,this.i)};g.da=function(){return this.i+1<this.f.length?new K(this.f,this.i+1):null};g.X=function(){var a=this.f.length-this.i;return 0>a?0:a};g.Db=function(){var a=Oa(this);return 0<a?new Mc(this,a-1,null):null};g.P=function(){return uc(this)};g.v=function(a,b){return zc.b?zc.b(this,b):zc.call(null,this,b)};g.Y=function(){return O};
g.$=function(a,b){return Kc(this.f,b,this.f[this.i],this.i+1)};g.aa=function(a,b,c){return Kc(this.f,b,c,this.i)};g.Z=function(){return this.f[this.i]};g.ea=function(){return this.i+1<this.f.length?new K(this.f,this.i+1):O};g.V=function(){return this.i<this.f.length?this:null};g.W=function(a,b){return Q.b?Q.b(b,this):Q.call(null,b,this)};K.prototype[Ka]=function(){return qc(this)};
var oc=function oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oc.a(arguments[0]);case 2:return oc.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};oc.a=function(a){return oc.b(a,0)};oc.b=function(a,b){return b<a.length?new K(a,b):null};oc.u=2;
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};nc.a=function(a){return oc.b(a,0)};nc.b=function(a,b){return oc.b(a,b)};nc.u=2;Ac;R;function Mc(a,b,c){this.zb=a;this.i=b;this.m=c;this.h=32374990;this.w=8192}g=Mc.prototype;g.toString=function(){return Yb(this)};
g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};g.da=function(){return 0<this.i?new Mc(this.zb,this.i-1,null):null};g.X=function(){return this.i+1};g.P=function(){return uc(this)};g.v=function(a,b){return zc.b?zc.b(this,b):zc.call(null,this,b)};g.Y=function(){var a=O,b=this.m;return Ac.b?Ac.b(a,b):Ac.call(null,a,b)};g.$=function(a,b){return R.b?R.b(b,this):R.call(null,b,this)};g.aa=function(a,b,c){return R.c?R.c(b,c,this):R.call(null,b,c,this)};
g.Z=function(){return D.b(this.zb,this.i)};g.ea=function(){return 0<this.i?new Mc(this.zb,this.i-1,null):O};g.V=function(){return this};g.O=function(a,b){return new Mc(this.zb,this.i,b)};g.W=function(a,b){return Q.b?Q.b(b,this):Q.call(null,b,this)};Mc.prototype[Ka]=function(){return qc(this)};ub._=function(a,b){return a===b};
var Rc=function Rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rc.o();case 1:return Rc.a(arguments[0]);case 2:return Rc.b(arguments[0],arguments[1]);default:return Rc.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Rc.o=function(){return Sc};Rc.a=function(a){return a};Rc.b=function(a,b){return null!=a?Ta(a,b):Ta(O,b)};Rc.l=function(a,b,c){for(;;)if(v(c))a=Rc.b(a,b),b=M(c),c=P(c);else return Rc.b(a,b)};
Rc.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return Rc.l(b,a,c)};Rc.u=2;function U(a){if(null!=a)if(null!=a&&(a.h&2||a.jc))a=a.X(null);else if(Ga(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.h&8388608||a.vc))a:{a=L(a);for(var b=0;;){if(Oc(a)){a=b+Oa(a);break a}a=P(a);b+=1}}else a=Oa(a);else a=0;return a}function Uc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return L(a)?M(a):c;if(Pc(a))return D.c(a,b,c);if(L(a)){var d=P(a),e=b-1;a=d;b=e}else return c}}
function Vc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.h&16||a.Xb))return a.T(null,b);if(Ga(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.h&64||a.ba)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(L(c)){c=M(c);break a}throw Error("Index out of bounds");}if(Pc(c)){c=D.b(c,d);break a}if(L(c))c=P(c),--d;else throw Error("Index out of bounds");
}}return c}if(x(Ua,a))return D.b(a,b);throw Error([A("nth not supported on this type "),A(Ia(null==a?null:a.constructor))].join(""));}
function V(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.h&16||a.Xb))return a.ka(null,b,null);if(Ga(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.h&64||a.ba))return Uc(a,b);if(x(Ua,a))return D.b(a,b);throw Error([A("nth not supported on this type "),A(Ia(null==a?null:a.constructor))].join(""));}
var J=function J(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return J.b(arguments[0],arguments[1]);case 3:return J.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};J.b=function(a,b){return null==a?null:null!=a&&(a.h&256||a.oc)?a.K(null,b):Ga(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:x($a,a)?ab.b(a,b):null};
J.c=function(a,b,c){return null!=a?null!=a&&(a.h&256||a.oc)?a.H(null,b,c):Ga(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:x($a,a)?ab.c(a,b,c):c:c};J.u=3;Wc;var Xc=function Xc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Xc.c(arguments[0],arguments[1],arguments[2]);default:return Xc.l(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};
Xc.c=function(a,b,c){if(null!=a)a=db(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Ib(Yc);;)if(d<b){var f=d+1;e=e.tb(null,a[d],c[d]);d=f}else{a=Kb(e);break a}}return a};Xc.l=function(a,b,c,d){for(;;)if(a=Xc.c(a,b,c),v(d))b=M(d),c=M(P(d)),d=P(P(d));else return a};Xc.B=function(a){var b=M(a),c=P(a);a=M(c);var d=P(c),c=M(d),d=P(d);return Xc.l(b,a,c,d)};Xc.u=3;
var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Zc.a(arguments[0]);case 2:return Zc.b(arguments[0],arguments[1]);default:return Zc.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Zc.a=function(a){return a};Zc.b=function(a,b){return null==a?null:gb(a,b)};Zc.l=function(a,b,c){for(;;){if(null==a)return null;a=Zc.b(a,b);if(v(c))b=M(c),c=P(c);else return a}};
Zc.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return Zc.l(b,a,c)};Zc.u=2;function $c(a,b){this.g=a;this.m=b;this.h=393217;this.w=0}g=$c.prototype;g.N=function(){return this.m};g.O=function(a,b){return new $c(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa,wa){a=this;return C.Ab?C.Ab(a.g,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa,wa):C.call(null,a.g,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa,wa)}function b(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa){a=this;return a.g.Qa?a.g.Qa(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T,xa)}function c(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T){a=this;return a.g.Pa?a.g.Pa(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,
G,E,H,T):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H,T)}function d(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H){a=this;return a.g.Oa?a.g.Oa(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E,H)}function e(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E){a=this;return a.g.Na?a.g.Na(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,E)}function f(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G){a=this;return a.g.Ma?a.g.Ma(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G):a.g.call(null,
b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G)}function h(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B){a=this;return a.g.La?a.g.La(b,c,d,e,f,h,k,l,m,n,r,q,u,z,B):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B)}function k(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z){a=this;return a.g.Ka?a.g.Ka(b,c,d,e,f,h,k,l,m,n,r,q,u,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u,z)}function l(a,b,c,d,e,f,h,k,l,m,n,r,q,u){a=this;return a.g.Ja?a.g.Ja(b,c,d,e,f,h,k,l,m,n,r,q,u):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q,u)}function m(a,b,c,d,e,f,h,k,l,m,n,r,q){a=this;
return a.g.Ia?a.g.Ia(b,c,d,e,f,h,k,l,m,n,r,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r,q)}function n(a,b,c,d,e,f,h,k,l,m,n,r){a=this;return a.g.Ha?a.g.Ha(b,c,d,e,f,h,k,l,m,n,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,r)}function r(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.Ga?a.g.Ga(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.Sa?a.g.Sa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function u(a,b,c,d,e,f,h,k,l){a=this;return a.g.Ra?a.g.Ra(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function z(a,b,c,d,e,f,h,k){a=this;return a.g.qa?a.g.qa(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function B(a,b,c,d,e,f,h){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function G(a,b,c,d,e,f){a=this;return a.g.I?a.g.I(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function H(a,b,c,d,e){a=this;return a.g.A?a.g.A(b,c,d,e):a.g.call(null,b,c,d,e)}function S(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function T(a,b,c){a=this;
return a.g.b?a.g.b(b,c):a.g.call(null,b,c)}function wa(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function xa(a){a=this;return a.g.o?a.g.o():a.g.call(null)}var E=null,E=function(E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd,ke,mf,Jg,ji){switch(arguments.length){case 1:return xa.call(this,E);case 2:return wa.call(this,E,ea);case 3:return T.call(this,E,ea,pa);case 4:return S.call(this,E,ea,pa,qa);case 5:return H.call(this,E,ea,pa,qa,Ra);case 6:return G.call(this,E,ea,pa,qa,Ra,Ja);case 7:return B.call(this,
E,ea,pa,qa,Ra,Ja,Ya);case 8:return z.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb);case 9:return u.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb);case 10:return q.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa);case 11:return r.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb);case 12:return n.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb);case 13:return m.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb);case 14:return l.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc);case 15:return k.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,
Rb,bc,Hb);case 16:return h.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec);case 17:return f.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc);case 18:return e.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd);case 19:return d.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd,ke);case 20:return c.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd,ke,mf);case 21:return b.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd,ke,mf,
Jg);case 22:return a.call(this,E,ea,pa,qa,Ra,Ja,Ya,cb,fb,Sa,wb,Gb,Rb,bc,Hb,Ec,Tc,sd,ke,mf,Jg,ji)}throw Error("Invalid arity: "+arguments.length);};E.a=xa;E.b=wa;E.c=T;E.A=S;E.I=H;E.pa=G;E.qa=B;E.Ra=z;E.Sa=u;E.Ga=q;E.Ha=r;E.Ia=n;E.Ja=m;E.Ka=l;E.La=k;E.Ma=h;E.Na=f;E.Oa=e;E.Pa=d;E.Qa=c;E.nc=b;E.Ab=a;return E}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.o=function(){return this.g.o?this.g.o():this.g.call(null)};
g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.A=function(a,b,c,d){return this.g.A?this.g.A(a,b,c,d):this.g.call(null,a,b,c,d)};g.I=function(a,b,c,d,e){return this.g.I?this.g.I(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.pa=function(a,b,c,d,e,f){return this.g.pa?this.g.pa(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.qa=function(a,b,c,d,e,f,h){return this.g.qa?this.g.qa(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.Ra=function(a,b,c,d,e,f,h,k){return this.g.Ra?this.g.Ra(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.Sa=function(a,b,c,d,e,f,h,k,l){return this.g.Sa?this.g.Sa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.Ga=function(a,b,c,d,e,f,h,k,l,m){return this.g.Ga?this.g.Ga(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.Ha=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.Ha?this.g.Ha(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.Ia=function(a,b,c,d,e,f,h,k,l,m,n,r){return this.g.Ia?this.g.Ia(a,b,c,d,e,f,h,k,l,m,n,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r)};g.Ja=function(a,b,c,d,e,f,h,k,l,m,n,r,q){return this.g.Ja?this.g.Ja(a,b,c,d,e,f,h,k,l,m,n,r,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q)};
g.Ka=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u){return this.g.Ka?this.g.Ka(a,b,c,d,e,f,h,k,l,m,n,r,q,u):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u)};g.La=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z){return this.g.La?this.g.La(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z)};g.Ma=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B){return this.g.Ma?this.g.Ma(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B)};
g.Na=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G){return this.g.Na?this.g.Na(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G)};g.Oa=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H){return this.g.Oa?this.g.Oa(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H)};
g.Pa=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S){return this.g.Pa?this.g.Pa(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S)};g.Qa=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T){return this.g.Qa?this.g.Qa(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T)};
g.nc=function(a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa){return C.Ab?C.Ab(this.g,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa):C.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa)};function Ac(a,b){return"function"==p(a)?new $c(a,b):null==a?null:rb(a,b)}function ad(a){var b=null!=a;return(b?null!=a?a.h&131072||a.rc||(a.h?0:x(pb,a)):x(pb,a):b)?qb(a):null}
var bd=function bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bd.a(arguments[0]);case 2:return bd.b(arguments[0],arguments[1]);default:return bd.l(arguments[0],arguments[1],new K(c.slice(2),0))}};bd.a=function(a){return a};bd.b=function(a,b){return null==a?null:lb(a,b)};bd.l=function(a,b,c){for(;;){if(null==a)return null;a=bd.b(a,b);if(v(c))b=M(c),c=P(c);else return a}};
bd.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return bd.l(b,a,c)};bd.u=2;function cd(a){return null==a?!1:null!=a?a.h&4096||a.Sc?!0:a.h?!1:x(kb,a):x(kb,a)}function dd(a){return null!=a?a.h&16777216||a.Rc?!0:a.h?!1:x(zb,a):x(zb,a)}function ed(a){return null==a?!1:null!=a?a.h&1024||a.pc?!0:a.h?!1:x(eb,a):x(eb,a)}function fd(a){return null!=a?a.h&16384||a.Tc?!0:a.h?!1:x(mb,a):x(mb,a)}gd;hd;function id(a){return null!=a?a.w&512||a.Mc?!0:!1:!1}
function jd(a){var b=[];ia(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function kd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var ld={};function md(a){return null==a?!1:null!=a?a.h&64||a.ba?!0:a.h?!1:x(Va,a):x(Va,a)}function nd(a){return null==a?!1:!1===a?!1:!0}function od(a,b){return J.c(a,b,ld)===ld?!1:!0}
function fc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return la(a,b);throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));}if(null!=a?a.w&2048||a.pb||(a.w?0:x(Nb,a)):x(Nb,a))return Ob(a,b);if("string"!==typeof a&&!Ga(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));return la(a,b)}
function pd(a,b){var c=U(a),d=U(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=fc(Vc(a,d),Vc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function qd(a){return I.b(a,fc)?fc:function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return"number"===typeof d?d:v(d)?-1:v(a.b?a.b(c,b):a.call(null,c,b))?1:0}}rd;function td(a){return ud(fc,a)}function ud(a,b){if(L(b)){var c=rd.a?rd.a(b):rd.call(null,b),d=qd(a);ma(c,d);return L(c)}return O}function vd(a,b){return wd(a,b)}
function wd(a,b){var c=fc;return ud(function(b,e){return qd(c).call(null,a.a?a.a(b):a.call(null,b),a.a?a.a(e):a.call(null,e))},b)}var R=function R(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return R.b(arguments[0],arguments[1]);case 3:return R.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
R.b=function(a,b){var c=L(b);if(c){var d=M(c),c=P(c);return Ma.c?Ma.c(a,d,c):Ma.call(null,a,d,c)}return a.o?a.o():a.call(null)};R.c=function(a,b,c){for(c=L(c);;)if(c){var d=M(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Fc(b))return ob(b);c=P(c)}else return b};R.u=3;xd;
var Ma=function Ma(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ma.b(arguments[0],arguments[1]);case 3:return Ma.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ma.b=function(a,b){return null!=b&&(b.h&524288||b.tc)?b.$(null,a):Ga(b)?Ic(b,a):"string"===typeof b?Ic(b,a):x(sb,b)?tb.b(b,a):R.b(a,b)};
Ma.c=function(a,b,c){return null!=c&&(c.h&524288||c.tc)?c.aa(null,a,b):Ga(c)?Jc(c,a,b):"string"===typeof c?Jc(c,a,b):x(sb,c)?tb.c(c,a,b):R.c(a,b,c)};Ma.u=3;function yd(a){return a}function zd(a,b,c,d){a=a.a?a.a(b):a.call(null,b);c=Ma.c(a,c,d);return a.a?a.a(c):a.call(null,c)}({}).Uc;function Ad(a){return a-1}Bd;function Bd(a,b){return(a%b+b)%b}function Cd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}
function Dd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Ed(a,b){for(var c=b,d=L(a);;)if(d&&0<c)--c,d=P(d);else return d}var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return A.o();case 1:return A.a(arguments[0]);default:return A.l(arguments[0],new K(c.slice(1),0))}};A.o=function(){return""};A.a=function(a){return null==a?"":""+a};
A.l=function(a,b){for(var c=new ja(""+A(a)),d=b;;)if(v(d))c=c.append(""+A(M(d))),d=P(d);else return c.toString()};A.B=function(a){var b=M(a);a=P(a);return A.l(b,a)};A.u=1;W;Fd;function zc(a,b){var c;if(dd(b))if(Oc(a)&&Oc(b)&&U(a)!==U(b))c=!1;else a:{c=L(a);for(var d=L(b);;){if(null==c){c=null==d;break a}if(null!=d&&I.b(M(c),M(d)))c=P(c),d=P(d);else{c=!1;break a}}}else c=null;return nd(c)}
function Lc(a){if(L(a)){var b=jc(M(a));for(a=P(a);;){if(null==a)return b;b=kc(b,jc(M(a)));a=P(a)}}else return 0}Gd;Hd;Fd;Id;Jd;function Nc(a,b,c,d,e){this.m=a;this.first=b;this.ia=c;this.count=d;this.s=e;this.h=65937646;this.w=8192}g=Nc.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};g.da=function(){return 1===this.count?null:this.ia};g.X=function(){return this.count};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};
g.v=function(a,b){return zc(this,b)};g.Y=function(){return rb(O,this.m)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return this.first};g.ea=function(){return 1===this.count?O:this.ia};g.V=function(){return this};g.O=function(a,b){return new Nc(b,this.first,this.ia,this.count,this.s)};g.W=function(a,b){return new Nc(this.m,b,this,this.count+1,null)};Nc.prototype[Ka]=function(){return qc(this)};
function Kd(a){this.m=a;this.h=65937614;this.w=8192}g=Kd.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};g.da=function(){return null};g.X=function(){return 0};g.P=function(){return vc};g.v=function(a,b){return(null!=b?b.h&33554432||b.Pc||(b.h?0:x(Ab,b)):x(Ab,b))||dd(b)?null==L(b):!1};g.Y=function(){return this};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return null};
g.ea=function(){return O};g.V=function(){return null};g.O=function(a,b){return new Kd(b)};g.W=function(a,b){return new Nc(this.m,b,null,1,null)};var O=new Kd(null);Kd.prototype[Ka]=function(){return qc(this)};function Ld(a){return(null!=a?a.h&134217728||a.Qc||(a.h?0:x(Bb,a)):x(Bb,a))?Cb(a):Ma.c(Rc,O,a)}var ec=function ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ec.l(0<c.length?new K(c.slice(0),0):null)};
ec.l=function(a){var b;if(a instanceof K&&0===a.i)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.Z(null)),a=a.da(null);else break a;a=b.length;for(var c=O;;)if(0<a){var d=a-1,c=c.W(null,b[a-1]);a=d}else return c};ec.u=0;ec.B=function(a){return ec.l(L(a))};function Md(a,b,c,d){this.m=a;this.first=b;this.ia=c;this.s=d;this.h=65929452;this.w=8192}g=Md.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};
g.da=function(){return null==this.ia?null:L(this.ia)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return this.first};g.ea=function(){return null==this.ia?O:this.ia};g.V=function(){return this};g.O=function(a,b){return new Md(b,this.first,this.ia,this.s)};g.W=function(a,b){return new Md(null,b,this,this.s)};
Md.prototype[Ka]=function(){return qc(this)};function Q(a,b){var c=null==b;return(c?c:null!=b&&(b.h&64||b.ba))?new Md(null,a,b,null):new Md(null,a,L(b),null)}function Nd(a,b){if(a.ta===b.ta)return 0;var c=Ha(a.ha);if(v(c?b.ha:c))return-1;if(v(a.ha)){if(Ha(b.ha))return 1;c=la(a.ha,b.ha);return 0===c?la(a.name,b.name):c}return la(a.name,b.name)}function w(a,b,c,d){this.ha=a;this.name=b;this.ta=c;this.hb=d;this.h=2153775105;this.w=4096}g=w.prototype;g.toString=function(){return[A(":"),A(this.ta)].join("")};
g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof w?this.ta===b.ta:!1};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return J.b(c,this);case 3:return J.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return J.b(c,this)};a.c=function(a,c,d){return J.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return J.b(a,this)};
g.b=function(a,b){return J.c(a,this,b)};g.P=function(){var a=this.hb;return null!=a?a:this.hb=a=kc(dc(this.name),ic(this.ha))+2654435769|0};g.L=function(a,b){return Db(b,[A(":"),A(this.ta)].join(""))};function Od(a,b){return a===b?!0:a instanceof w&&b instanceof w?a.ta===b.ta:!1}
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Pd.a(arguments[0]);case 2:return Pd.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Pd.a=function(a){if(a instanceof w)return a;if(a instanceof F){var b;if(null!=a&&(a.w&4096||a.sc))b=a.ha;else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new w(b,Fd.a?Fd.a(a):Fd.call(null,a),a.Da,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new w(b[0],b[1],a,null):new w(null,b[0],a,null)):null};Pd.b=function(a,b){return new w(a,b,[A(v(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)};Pd.u=2;
function Qd(a,b,c,d){this.m=a;this.mb=b;this.C=c;this.s=d;this.h=32374988;this.w=0}g=Qd.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};function Rd(a){null!=a.mb&&(a.C=a.mb.o?a.mb.o():a.mb.call(null),a.mb=null);return a.C}g.N=function(){return this.m};g.da=function(){yb(this);return null==this.C?null:P(this.C)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};
g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){yb(this);return null==this.C?null:M(this.C)};g.ea=function(){yb(this);return null!=this.C?N(this.C):O};g.V=function(){Rd(this);if(null==this.C)return null;for(var a=this.C;;)if(a instanceof Qd)a=Rd(a);else return this.C=a,L(this.C)};g.O=function(a,b){return new Qd(b,this.mb,this.C,this.s)};g.W=function(a,b){return Q(b,this)};Qd.prototype[Ka]=function(){return qc(this)};Sd;
function Td(a,b){this.G=a;this.end=b;this.h=2;this.w=0}Td.prototype.add=function(a){this.G[this.end]=a;return this.end+=1};Td.prototype.S=function(){var a=new Sd(this.G,0,this.end);this.G=null;return a};Td.prototype.X=function(){return this.end};function Ud(a){return new Td(Array(a),0)}function Sd(a,b,c){this.f=a;this.ca=b;this.end=c;this.h=524306;this.w=0}g=Sd.prototype;g.X=function(){return this.end-this.ca};g.T=function(a,b){return this.f[this.ca+b]};
g.ka=function(a,b,c){return 0<=b&&b<this.end-this.ca?this.f[this.ca+b]:c};g.Wb=function(){if(this.ca===this.end)throw Error("-drop-first of empty chunk");return new Sd(this.f,this.ca+1,this.end)};g.$=function(a,b){return Kc(this.f,b,this.f[this.ca],this.ca+1)};g.aa=function(a,b,c){return Kc(this.f,b,c,this.ca)};function gd(a,b,c,d){this.S=a;this.Ba=b;this.m=c;this.s=d;this.h=31850732;this.w=1536}g=gd.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};
g.da=function(){if(1<Oa(this.S))return new gd(Pb(this.S),this.Ba,this.m,null);var a=yb(this.Ba);return null==a?null:a};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};g.Z=function(){return D.b(this.S,0)};g.ea=function(){return 1<Oa(this.S)?new gd(Pb(this.S),this.Ba,this.m,null):null==this.Ba?O:this.Ba};g.V=function(){return this};g.Nb=function(){return this.S};g.Ob=function(){return null==this.Ba?O:this.Ba};
g.O=function(a,b){return new gd(this.S,this.Ba,b,this.s)};g.W=function(a,b){return Q(b,this)};g.Mb=function(){return null==this.Ba?null:this.Ba};gd.prototype[Ka]=function(){return qc(this)};function Vd(a,b){return 0===Oa(a)?b:new gd(a,b,null,null)}function Wd(a,b){a.add(b)}function Id(a){return Qb(a)}function Jd(a){return Sb(a)}function rd(a){for(var b=[];;)if(L(a))b.push(M(a)),a=P(a);else return b}
function Xd(a){if("number"===typeof a)a:{var b=Array(a);if(md(null))for(var c=0,d=L(null);;)if(d&&c<a)b[c]=M(d),c+=1,d=P(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Da.a(a);return a}function Yd(a,b){if(Oc(a))return U(a);for(var c=a,d=b,e=0;;)if(0<d&&L(c))c=P(c),--d,e+=1;else return e}
var Zd=function Zd(b){return null==b?null:null==P(b)?L(M(b)):Q(M(b),Zd(P(b)))},$d=function $d(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return $d.o();case 1:return $d.a(arguments[0]);case 2:return $d.b(arguments[0],arguments[1]);default:return $d.l(arguments[0],arguments[1],new K(c.slice(2),0))}};$d.o=function(){return new Qd(null,function(){return null},null,null)};$d.a=function(a){return new Qd(null,function(){return a},null,null)};
$d.b=function(a,b){return new Qd(null,function(){var c=L(a);return c?id(c)?Vd(Qb(c),$d.b(Sb(c),b)):Q(M(c),$d.b(N(c),b)):b},null,null)};$d.l=function(a,b,c){return function e(a,b){return new Qd(null,function(){var c=L(a);return c?id(c)?Vd(Qb(c),e(Sb(c),b)):Q(M(c),e(N(c),b)):v(b)?e(M(b),P(b)):null},null,null)}($d.b(a,b),c)};$d.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return $d.l(b,a,c)};$d.u=2;function ae(a){return Kb(a)}
var be=function be(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return be.o();case 1:return be.a(arguments[0]);case 2:return be.b(arguments[0],arguments[1]);default:return be.l(arguments[0],arguments[1],new K(c.slice(2),0))}};be.o=function(){return Ib(Sc)};be.a=function(a){return a};be.b=function(a,b){return Jb(a,b)};be.l=function(a,b,c){for(;;)if(a=Jb(a,b),v(c))b=M(c),c=P(c);else return a};
be.B=function(a){var b=M(a),c=P(a);a=M(c);c=P(c);return be.l(b,a,c)};be.u=2;
function ce(a,b,c){var d=L(c);if(0===b)return a.o?a.o():a.call(null);c=Wa(d);var e=Xa(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Wa(e),f=Xa(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Wa(f),h=Xa(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Wa(h),k=Xa(h);if(4===b)return a.A?a.A(c,d,e,f):a.A?a.A(c,d,e,f):a.call(null,c,d,e,f);var h=Wa(k),l=Xa(k);if(5===b)return a.I?a.I(c,d,e,f,h):a.I?a.I(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Wa(l),
m=Xa(l);if(6===b)return a.pa?a.pa(c,d,e,f,h,k):a.pa?a.pa(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Wa(m),n=Xa(m);if(7===b)return a.qa?a.qa(c,d,e,f,h,k,l):a.qa?a.qa(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Wa(n),r=Xa(n);if(8===b)return a.Ra?a.Ra(c,d,e,f,h,k,l,m):a.Ra?a.Ra(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Wa(r),q=Xa(r);if(9===b)return a.Sa?a.Sa(c,d,e,f,h,k,l,m,n):a.Sa?a.Sa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var r=Wa(q),u=Xa(q);if(10===b)return a.Ga?a.Ga(c,
d,e,f,h,k,l,m,n,r):a.Ga?a.Ga(c,d,e,f,h,k,l,m,n,r):a.call(null,c,d,e,f,h,k,l,m,n,r);var q=Wa(u),z=Xa(u);if(11===b)return a.Ha?a.Ha(c,d,e,f,h,k,l,m,n,r,q):a.Ha?a.Ha(c,d,e,f,h,k,l,m,n,r,q):a.call(null,c,d,e,f,h,k,l,m,n,r,q);var u=Wa(z),B=Xa(z);if(12===b)return a.Ia?a.Ia(c,d,e,f,h,k,l,m,n,r,q,u):a.Ia?a.Ia(c,d,e,f,h,k,l,m,n,r,q,u):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u);var z=Wa(B),G=Xa(B);if(13===b)return a.Ja?a.Ja(c,d,e,f,h,k,l,m,n,r,q,u,z):a.Ja?a.Ja(c,d,e,f,h,k,l,m,n,r,q,u,z):a.call(null,c,d,e,f,h,k,l,
m,n,r,q,u,z);var B=Wa(G),H=Xa(G);if(14===b)return a.Ka?a.Ka(c,d,e,f,h,k,l,m,n,r,q,u,z,B):a.Ka?a.Ka(c,d,e,f,h,k,l,m,n,r,q,u,z,B):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B);var G=Wa(H),S=Xa(H);if(15===b)return a.La?a.La(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G):a.La?a.La(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G);var H=Wa(S),T=Xa(S);if(16===b)return a.Ma?a.Ma(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H):a.Ma?a.Ma(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H);var S=
Wa(T),wa=Xa(T);if(17===b)return a.Na?a.Na(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S):a.Na?a.Na(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S);var T=Wa(wa),xa=Xa(wa);if(18===b)return a.Oa?a.Oa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T):a.Oa?a.Oa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T);wa=Wa(xa);xa=Xa(xa);if(19===b)return a.Pa?a.Pa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa):a.Pa?a.Pa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa):a.call(null,
c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa);var E=Wa(xa);Xa(xa);if(20===b)return a.Qa?a.Qa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa,E):a.Qa?a.Qa(c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa,E):a.call(null,c,d,e,f,h,k,l,m,n,r,q,u,z,B,G,H,S,T,wa,E);throw Error("Only up to 20 arguments supported on functions");}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.b(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);case 4:return C.A(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return C.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return C.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new K(c.slice(5),0))}};
C.b=function(a,b){var c=a.u;if(a.B){var d=Yd(b,c+1);return d<=c?ce(a,d,b):a.B(b)}return a.apply(a,rd(b))};C.c=function(a,b,c){b=Q(b,c);c=a.u;if(a.B){var d=Yd(b,c+1);return d<=c?ce(a,d,b):a.B(b)}return a.apply(a,rd(b))};C.A=function(a,b,c,d){b=Q(b,Q(c,d));c=a.u;return a.B?(d=Yd(b,c+1),d<=c?ce(a,d,b):a.B(b)):a.apply(a,rd(b))};C.I=function(a,b,c,d,e){b=Q(b,Q(c,Q(d,e)));c=a.u;return a.B?(d=Yd(b,c+1),d<=c?ce(a,d,b):a.B(b)):a.apply(a,rd(b))};
C.l=function(a,b,c,d,e,f){b=Q(b,Q(c,Q(d,Q(e,Zd(f)))));c=a.u;return a.B?(d=Yd(b,c+1),d<=c?ce(a,d,b):a.B(b)):a.apply(a,rd(b))};C.B=function(a){var b=M(a),c=P(a);a=M(c);var d=P(c),c=M(d),e=P(d),d=M(e),f=P(e),e=M(f),f=P(f);return C.l(b,a,c,d,e,f)};C.u=5;
var de=function de(){"undefined"===typeof na&&(na=function(b,c){this.Ic=b;this.Hc=c;this.h=393216;this.w=0},na.prototype.O=function(b,c){return new na(this.Ic,c)},na.prototype.N=function(){return this.Hc},na.prototype.fa=function(){return!1},na.prototype.next=function(){return Error("No such element")},na.prototype.remove=function(){return Error("Unsupported operation")},na.Rb=function(){return new X(null,2,5,Y,[Ac(ee,new t(null,1,[fe,ec(ge,ec(Sc))],null)),he],null)},na.ub=!0,na.cb="cljs.core/t_cljs$core20057",
na.Gb=function(b,c){return Db(c,"cljs.core/t_cljs$core20057")});return new na(de,ie)};je;function je(a,b,c,d){this.ob=a;this.first=b;this.ia=c;this.m=d;this.h=31719628;this.w=0}g=je.prototype;g.O=function(a,b){return new je(this.ob,this.first,this.ia,b)};g.W=function(a,b){return Q(b,yb(this))};g.Y=function(){return O};g.v=function(a,b){return null!=yb(this)?zc(this,b):dd(b)&&null==L(b)};g.P=function(){return uc(this)};g.V=function(){null!=this.ob&&this.ob.step(this);return null==this.ia?null:this};
g.Z=function(){null!=this.ob&&yb(this);return null==this.ia?null:this.first};g.ea=function(){null!=this.ob&&yb(this);return null==this.ia?O:this.ia};g.da=function(){null!=this.ob&&yb(this);return null==this.ia?null:yb(this.ia)};je.prototype[Ka]=function(){return qc(this)};function le(a,b){for(;;){if(null==L(b))return!0;var c;c=M(b);c=a.a?a.a(c):a.call(null,c);if(v(c)){c=a;var d=P(b);a=c;b=d}else return!1}}
function me(a){return function(){function b(b,c){return Ha(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Ha(a.a?a.a(b):a.call(null,b))}function d(){return Ha(a.o?a.o():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new K(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ha(C.A(a,b,d,e))}b.u=2;b.B=function(a){var b=M(a);a=P(a);var d=M(a);a=N(a);return c(b,d,a)};b.l=c;
return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new K(n,0)}return f.l(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.u=2;e.B=f.B;e.o=d;e.a=c;e.b=b;e.l=f.l;return e}()}
function ne(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.u=0;a.B=function(a){L(a);return!1};a.l=function(){return!1};return a}()}
var oe=function oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return oe.o();case 1:return oe.a(arguments[0]);case 2:return oe.b(arguments[0],arguments[1]);case 3:return oe.c(arguments[0],arguments[1],arguments[2]);default:return oe.l(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};oe.o=function(){return yd};oe.a=function(a){return a};
oe.b=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.a?a.a(c):a.call(null,c)}function d(c,d){var e=b.b?b.b(c,d):b.call(null,c,d);return a.a?a.a(e):a.call(null,e)}function e(c){c=b.a?b.a(c):b.call(null,c);return a.a?a.a(c):a.call(null,c)}function f(){var c=b.o?b.o():b.call(null);return a.a?a.a(c):a.call(null,c)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new K(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){c=C.I(b,c,e,f,h);return a.a?a.a(c):a.call(null,c)}c.u=3;c.B=function(a){var b=M(a);a=P(a);var c=M(a);a=P(a);var e=M(a);a=N(a);return d(b,c,e,a)};c.l=d;return c}(),h=function(a,b,h,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var q=null;if(3<arguments.length){for(var q=0,u=Array(arguments.length-3);q<u.length;)u[q]=arguments[q+
3],++q;q=new K(u,0)}return k.l(a,b,h,q)}throw Error("Invalid arity: "+arguments.length);};h.u=3;h.B=k.B;h.o=f;h.a=e;h.b=d;h.c=c;h.l=k.l;return h}()};
oe.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function e(d,e){var f;f=c.b?c.b(d,e):c.call(null,d,e);f=b.a?b.a(f):b.call(null,f);return a.a?a.a(f):a.call(null,f)}function f(d){d=c.a?c.a(d):c.call(null,d);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function h(){var d;d=c.o?c.o():c.call(null);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new K(k,0)}return e.call(this,a,b,c,h)}function e(d,f,h,k){d=C.I(c,d,f,h,k);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}d.u=3;d.B=function(a){var b=M(a);a=P(a);var c=M(a);a=P(a);var d=M(a);a=N(a);return e(b,c,d,a)};d.l=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var u=null;if(3<arguments.length){for(var u=0,z=Array(arguments.length-3);u<z.length;)z[u]=arguments[u+3],++u;u=new K(z,0)}return l.l(a,b,c,u)}throw Error("Invalid arity: "+arguments.length);};k.u=3;k.B=l.B;k.o=h;k.a=f;k.b=e;k.c=d;k.l=l.l;return k}()};
oe.l=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return c.call(this,d)}function c(b){b=C.b(M(a),b);for(var d=P(a);;)if(d)b=M(d).call(null,b),d=P(d);else return b}b.u=0;b.B=function(a){a=L(a);return c(a)};b.l=c;return b}()}(Ld(Q(a,Q(b,Q(c,d)))))};oe.B=function(a){var b=M(a),c=P(a);a=M(c);var d=P(c),c=M(d),d=P(d);return oe.l(b,a,c,d)};oe.u=3;pe;
function qe(a,b,c,d){this.state=a;this.m=b;this.Lc=c;this.hc=d;this.w=16386;this.h=6455296}g=qe.prototype;g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.qb=function(){return this.state};g.N=function(){return this.m};
g.$b=function(a,b,c){a=L(this.hc);for(var d=null,e=0,f=0;;)if(f<e){var h=d.T(null,f),k=V(h,0),h=V(h,1);h.A?h.A(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=L(a))id(a)?(d=Qb(a),a=Sb(a),k=d,e=U(d),d=k):(d=M(a),k=V(d,0),h=V(d,1),h.A?h.A(k,this,b,c):h.call(null,k,this,b,c),a=P(a),d=null,e=0),f=0;else return null};g.P=function(){return this[ca]||(this[ca]=++da)};
var re=function re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return re.a(arguments[0]);default:return re.l(arguments[0],new K(c.slice(1),0))}};re.a=function(a){return new qe(a,null,null,null)};re.l=function(a,b){var c=null!=b&&(b.h&64||b.ba)?C.b(yc,b):b,d=J.b(c,Aa),c=J.b(c,se);return new qe(a,d,c,null)};re.B=function(a){var b=M(a);a=P(a);return re.l(b,a)};re.u=1;te;
function ue(a,b){if(a instanceof qe){var c=a.Lc;if(null!=c&&!v(c.a?c.a(b):c.call(null,b)))throw Error([A("Assert failed: "),A("Validator rejected reference state"),A("\n"),A(function(){var a=ec(ve,we);return te.a?te.a(a):te.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.hc&&Fb(a,c,b);return b}return Ub(a,b)}
var xe=function xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return xe.b(arguments[0],arguments[1]);case 3:return xe.c(arguments[0],arguments[1],arguments[2]);case 4:return xe.A(arguments[0],arguments[1],arguments[2],arguments[3]);default:return xe.l(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};xe.b=function(a,b){var c;a instanceof qe?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=ue(a,c)):c=Vb.b(a,b);return c};
xe.c=function(a,b,c){if(a instanceof qe){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=ue(a,b)}else a=Vb.c(a,b,c);return a};xe.A=function(a,b,c,d){if(a instanceof qe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=ue(a,b)}else a=Vb.A(a,b,c,d);return a};xe.l=function(a,b,c,d,e){return a instanceof qe?ue(a,C.I(b,a.state,c,d,e)):Vb.I(a,b,c,d,e)};xe.B=function(a){var b=M(a),c=P(a);a=M(c);var d=P(c),c=M(d),e=P(d),d=M(e),e=P(e);return xe.l(b,a,c,d,e)};xe.u=4;
function ye(a){this.state=a;this.h=32768;this.w=0}ye.prototype.qb=function(){return this.state};function pe(a){return new ye(a)}
var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.a(arguments[0]);case 2:return W.b(arguments[0],arguments[1]);case 3:return W.c(arguments[0],arguments[1],arguments[2]);case 4:return W.A(arguments[0],arguments[1],arguments[2],arguments[3]);default:return W.l(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};
W.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new K(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=C.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.u=2;c.B=function(a){var b=
M(a);a=P(a);var c=M(a);a=N(a);return d(b,c,a)};c.l=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new K(r,0)}return h.l(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.u=2;f.B=h.B;f.o=e;f.a=d;f.b=c;f.l=h.l;return f}()}};
W.b=function(a,b){return new Qd(null,function(){var c=L(b);if(c){if(id(c)){for(var d=Qb(c),e=U(d),f=Ud(e),h=0;;)if(h<e)Wd(f,function(){var b=D.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Vd(f.S(),W.b(a,Sb(c)))}return Q(function(){var b=M(c);return a.a?a.a(b):a.call(null,b)}(),W.b(a,N(c)))}return null},null,null)};
W.c=function(a,b,c){return new Qd(null,function(){var d=L(b),e=L(c);if(d&&e){var f=Q,h;h=M(d);var k=M(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,W.c(a,N(d),N(e)))}else d=null;return d},null,null)};W.A=function(a,b,c,d){return new Qd(null,function(){var e=L(b),f=L(c),h=L(d);if(e&&f&&h){var k=Q,l;l=M(e);var m=M(f),n=M(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,W.A(a,N(e),N(f),N(h)))}else e=null;return e},null,null)};
W.l=function(a,b,c,d,e){var f=function k(a){return new Qd(null,function(){var b=W.b(L,a);return le(yd,b)?Q(W.b(M,b),k(W.b(N,b))):null},null,null)};return W.b(function(){return function(b){return C.b(a,b)}}(f),f(Rc.l(e,d,nc([c,b],0))))};W.B=function(a){var b=M(a),c=P(a);a=M(c);var d=P(c),c=M(d),e=P(d),d=M(e),e=P(e);return W.l(b,a,c,d,e)};W.u=4;
function ze(a,b){if("number"!==typeof a)throw Error([A("Assert failed: "),A(function(){var a=ec(Ae,Be);return te.a?te.a(a):te.call(null,a)}())].join(""));return new Qd(null,function(){if(0<a){var c=L(b);return c?Q(M(c),ze(a-1,N(c))):null}return null},null,null)}
function Ce(a,b){if("number"!==typeof a)throw Error([A("Assert failed: "),A(function(){var a=ec(Ae,Be);return te.a?te.a(a):te.call(null,a)}())].join(""));return new Qd(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=L(b);if(0<a&&e){var f=a-1,e=N(e);a=f;b=e}else return e}}),null,null)}var De=function De(b){return new Qd(null,function(){var c=L(b);return c?$d.b(c,De(c)):null},null,null)};Ee;function Fe(a,b){return C.b($d,C.c(W,a,b))}
function Ge(){var a=me(Fa);return function(b){return function(){function c(c,d){return v(a.a?a.a(d):a.call(null,d))?b.b?b.b(c,d):b.call(null,c,d):c}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.o=e;f.a=d;f.b=c;return f}()}}
function He(a,b){return new Qd(null,function(){var c=L(b);if(c){if(id(c)){for(var d=Qb(c),e=U(d),f=Ud(e),h=0;;)if(h<e){var k;k=D.b(d,h);k=a.a?a.a(k):a.call(null,k);v(k)&&(k=D.b(d,h),f.add(k));h+=1}else break;return Vd(f.S(),He(a,Sb(c)))}d=M(c);c=N(c);return v(a.a?a.a(d):a.call(null,d))?Q(d,He(a,c)):He(a,c)}return null},null,null)}function Ie(a,b){return He(me(a),b)}
function Je(a){return function c(a){return new Qd(null,function(){return Q(a,v(md.a?md.a(a):md.call(null,a))?Fe(c,nc([L.a?L.a(a):L.call(null,a)],0)):null)},null,null)}(a)}function Ke(a,b){return null!=a?null!=a&&(a.w&4||a.kc)?Ac(ae(Ma.c(Jb,Ib(a),b)),ad(a)):Ma.c(Ta,a,b):Ma.c(Rc,O,b)}function Le(a,b,c){return null!=a&&(a.w&4||a.kc)?Ac(ae(zd(b,be,Ib(a),c)),ad(a)):zd(b,Rc,a,c)}function Me(a,b){return ae(Ma.c(function(b,d){return be.b(b,a.a?a.a(d):a.call(null,d))},Ib(Sc),b))}
function Ne(a,b,c){return new Qd(null,function(){var d=L(c);if(d){var e=ze(a,d);return a===U(e)?Q(e,Ne(a,b,Ce(b,d))):null}return null},null,null)}var Oe=function Oe(b,c,d){var e=V(c,0);c=Ed(c,1);return v(c)?Xc.c(b,e,Oe(J.b(b,e),c,d)):Xc.c(b,e,d)};function Pe(a,b){var c=Qe;return Xc.c(a,c,function(){var d=J.b(a,c);return b.a?b.a(d):b.call(null,d)}())}function Re(a,b,c){return Xc.c(a,b,function(){var d=J.b(a,b);return bd.b?bd.b(d,c):bd.call(null,d,c)}())}
function Se(a,b,c,d,e){return Xc.c(a,b,function(){var f=J.b(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())}function Te(a,b){this.M=a;this.f=b}function Ue(a){return new Te(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ve(a){a=a.j;return 32>a?0:a-1>>>5<<5}function We(a,b,c){for(;;){if(0===b)return c;var d=Ue(a);d.f[0]=c;c=d;b-=5}}
var Xe=function Xe(b,c,d,e){var f=new Te(d.M,La(d.f)),h=b.j-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?Xe(b,c-5,d,e):We(null,c-5,e),f.f[h]=b);return f};function Ye(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function Ze(a,b){if(b>=Ve(a))return a.J;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function $e(a,b){return 0<=b&&b<a.j?Ze(a,b):Ye(b,a.j)}
var af=function af(b,c,d,e,f){var h=new Te(d.M,La(d.f));if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=af(b,c-5,d.f[k],e,f);h.f[k]=b}return h};function bf(a,b,c,d,e,f){this.i=a;this.Kb=b;this.f=c;this.Ea=d;this.start=e;this.end=f}bf.prototype.fa=function(){return this.i<this.end};bf.prototype.next=function(){32===this.i-this.Kb&&(this.f=Ze(this.Ea,this.i),this.Kb+=32);var a=this.f[this.i&31];this.i+=1;return a};cf;df;ef;Cc;ff;Z;gf;
function X(a,b,c,d,e,f){this.m=a;this.j=b;this.shift=c;this.root=d;this.J=e;this.s=f;this.h=167668511;this.w=8196}g=X.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};g.T=function(a,b){return $e(this,b)[b&31]};g.ka=function(a,b,c){return 0<=b&&b<this.j?Ze(this,b)[b&31]:c};
g.bb=function(a,b,c){if(0<=b&&b<this.j)return Ve(this)<=b?(a=La(this.J),a[b&31]=c,new X(this.m,this.j,this.shift,this.root,a,null)):new X(this.m,this.j,this.shift,af(this,this.shift,this.root,b,c),this.J,null);if(b===this.j)return Ta(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.j),A("]")].join(""));};g.sa=function(){var a=this.j;return new bf(0,0,0<U(this)?Ze(this,0):null,this,0,a)};g.N=function(){return this.m};g.X=function(){return this.j};
g.rb=function(){return D.b(this,0)};g.sb=function(){return D.b(this,1)};g.Db=function(){return 0<this.j?new Mc(this,this.j-1,null):null};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){if(b instanceof X)if(this.j===U(b))for(var c=Wb(this),d=Wb(b);;)if(v(c.fa())){var e=c.next(),f=d.next();if(!I.b(e,f))return!1}else return!0;else return!1;else return zc(this,b)};
g.jb=function(){return new ef(this.j,this.shift,cf.a?cf.a(this.root):cf.call(null,this.root),df.a?df.a(this.J):df.call(null,this.J))};g.Y=function(){return Ac(Sc,this.m)};g.$=function(a,b){return Gc(this,b)};g.aa=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=Ze(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Fc(d)){e=d;break a}f+=1}else{e=d;break a}if(Fc(e))return Cc.a?Cc.a(e):Cc.call(null,e);a+=c;d=e}else return d};
g.Va=function(a,b,c){if("number"===typeof b)return nb(this,b,c);throw Error("Vector's key for assoc must be a number.");};g.V=function(){if(0===this.j)return null;if(32>=this.j)return new K(this.J,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return gf.A?gf.A(this,a,0,0):gf.call(null,this,a,0,0)};g.O=function(a,b){return new X(b,this.j,this.shift,this.root,this.J,this.s)};
g.W=function(a,b){if(32>this.j-Ve(this)){for(var c=this.J.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.J[e],e+=1;else break;d[c]=b;return new X(this.m,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Ue(null),d.f[0]=this.root,e=We(null,this.shift,new Te(null,this.J)),d.f[1]=e):d=Xe(this,this.shift,this.root,new Te(null,this.J));return new X(this.m,this.j+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.ka(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.T(null,c)};a.c=function(a,c,d){return this.ka(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.T(null,a)};g.b=function(a,b){return this.ka(null,a,b)};
var Y=new Te(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Sc=new X(null,0,5,Y,[],vc);function hf(a){var b=a.length;if(32>b)return new X(null,b,5,Y,a,null);for(var c=32,d=(new X(null,32,5,Y,a.slice(0,32),null)).jb(null);;)if(c<b)var e=c+1,d=be.b(d,a[c]),c=e;else return Kb(d)}X.prototype[Ka]=function(){return qc(this)};function xd(a){return Ga(a)?hf(a):Kb(Ma.c(Jb,Ib(Sc),a))}
var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jf.l(0<c.length?new K(c.slice(0),0):null)};jf.l=function(a){return a instanceof K&&0===a.i?hf(a.f):xd(a)};jf.u=0;jf.B=function(a){return jf.l(L(a))};kf;function hd(a,b,c,d,e,f){this.na=a;this.node=b;this.i=c;this.ca=d;this.m=e;this.s=f;this.h=32375020;this.w=1536}g=hd.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};
g.da=function(){if(this.ca+1<this.node.length){var a;a=this.na;var b=this.node,c=this.i,d=this.ca+1;a=gf.A?gf.A(a,b,c,d):gf.call(null,a,b,c,d);return null==a?null:a}return Tb(this)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(Sc,this.m)};g.$=function(a,b){var c;c=this.na;var d=this.i+this.ca,e=U(this.na);c=kf.c?kf.c(c,d,e):kf.call(null,c,d,e);return Gc(c,b)};
g.aa=function(a,b,c){a=this.na;var d=this.i+this.ca,e=U(this.na);a=kf.c?kf.c(a,d,e):kf.call(null,a,d,e);return Hc(a,b,c)};g.Z=function(){return this.node[this.ca]};g.ea=function(){if(this.ca+1<this.node.length){var a;a=this.na;var b=this.node,c=this.i,d=this.ca+1;a=gf.A?gf.A(a,b,c,d):gf.call(null,a,b,c,d);return null==a?O:a}return Sb(this)};g.V=function(){return this};g.Nb=function(){var a=this.node;return new Sd(a,this.ca,a.length)};
g.Ob=function(){var a=this.i+this.node.length;if(a<Oa(this.na)){var b=this.na,c=Ze(this.na,a);return gf.A?gf.A(b,c,a,0):gf.call(null,b,c,a,0)}return O};g.O=function(a,b){return gf.I?gf.I(this.na,this.node,this.i,this.ca,b):gf.call(null,this.na,this.node,this.i,this.ca,b)};g.W=function(a,b){return Q(b,this)};g.Mb=function(){var a=this.i+this.node.length;if(a<Oa(this.na)){var b=this.na,c=Ze(this.na,a);return gf.A?gf.A(b,c,a,0):gf.call(null,b,c,a,0)}return null};hd.prototype[Ka]=function(){return qc(this)};
var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return gf.c(arguments[0],arguments[1],arguments[2]);case 4:return gf.A(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return gf.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};gf.c=function(a,b,c){return new hd(a,$e(a,b),b,c,null,null)};
gf.A=function(a,b,c,d){return new hd(a,b,c,d,null,null)};gf.I=function(a,b,c,d,e){return new hd(a,b,c,d,e,null)};gf.u=5;lf;function nf(a,b,c,d,e){this.m=a;this.Ea=b;this.start=c;this.end=d;this.s=e;this.h=167666463;this.w=8192}g=nf.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};
g.T=function(a,b){return 0>b||this.end<=this.start+b?Ye(b,this.end-this.start):D.b(this.Ea,this.start+b)};g.ka=function(a,b,c){return 0>b||this.end<=this.start+b?c:D.c(this.Ea,this.start+b,c)};g.bb=function(a,b,c){var d=this.start+b;a=this.m;c=Xc.c(this.Ea,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return lf.I?lf.I(a,c,b,d,null):lf.call(null,a,c,b,d,null)};g.N=function(){return this.m};g.X=function(){return this.end-this.start};
g.Db=function(){return this.start!==this.end?new Mc(this,this.end-this.start-1,null):null};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(Sc,this.m)};g.$=function(a,b){return Gc(this,b)};g.aa=function(a,b,c){return Hc(this,b,c)};g.Va=function(a,b,c){if("number"===typeof b)return nb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};
g.V=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Q(D.b(a.Ea,e),new Qd(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};g.O=function(a,b){return lf.I?lf.I(b,this.Ea,this.start,this.end,this.s):lf.call(null,b,this.Ea,this.start,this.end,this.s)};g.W=function(a,b){var c=this.m,d=nb(this.Ea,this.end,b),e=this.start,f=this.end+1;return lf.I?lf.I(c,d,e,f,null):lf.call(null,c,d,e,f,null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.T(null,c);case 3:return this.ka(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.T(null,c)};a.c=function(a,c,d){return this.ka(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.T(null,a)};g.b=function(a,b){return this.ka(null,a,b)};nf.prototype[Ka]=function(){return qc(this)};
function lf(a,b,c,d,e){for(;;)if(b instanceof nf)c=b.start+c,d=b.start+d,b=b.Ea;else{var f=U(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new nf(a,b,c,d,e)}}var kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kf.b(arguments[0],arguments[1]);case 3:return kf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
kf.b=function(a,b){return kf.c(a,b,U(a))};kf.c=function(a,b,c){return lf(null,a,b,c,null)};kf.u=3;function of(a,b){return a===b.M?b:new Te(a,La(b.f))}function cf(a){return new Te({},La(a.f))}function df(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];kd(a,0,b,0,a.length);return b}
var pf=function pf(b,c,d,e){d=of(b.root.M,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?pf(b,c-5,h,e):We(b.root.M,c-5,e)}d.f[f]=b;return d};function ef(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.J=d;this.w=88;this.h=275}g=ef.prototype;
g.ab=function(a,b){if(this.root.M){if(32>this.j-Ve(this))this.J[this.j&31]=b;else{var c=new Te(this.root.M,this.J),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.J=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=We(this.root.M,this.shift,c);this.root=new Te(this.root.M,d);this.shift=e}else this.root=pf(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};g.kb=function(){if(this.root.M){this.root.M=null;var a=this.j-Ve(this),b=Array(a);kd(this.J,0,b,0,a);return new X(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.tb=function(a,b,c){if("number"===typeof b)return Mb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Zb=function(a,b,c){var d=this;if(d.root.M){if(0<=b&&b<d.j)return Ve(this)<=b?d.J[b&31]=c:(a=function(){return function f(a,k){var l=of(d.root.M,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return Jb(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.j)].join(""));}throw Error("assoc! after persistent!");};
g.X=function(){if(this.root.M)return this.j;throw Error("count after persistent!");};g.T=function(a,b){if(this.root.M)return $e(this,b)[b&31];throw Error("nth after persistent!");};g.ka=function(a,b,c){return 0<=b&&b<this.j?D.b(this,b):c};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};function qf(){this.h=2097152;this.w=0}
qf.prototype.equiv=function(a){return this.v(null,a)};qf.prototype.v=function(){return!1};var rf=new qf;function sf(a,b){return nd(ed(b)?U(a)===U(b)?le(yd,W.b(function(a){return I.b(J.c(b,M(a),rf),M(P(a)))},a)):null:null)}function tf(a,b,c,d,e){this.i=a;this.Jc=b;this.Tb=c;this.Bc=d;this.fc=e}tf.prototype.fa=function(){var a=this.i<this.Tb;return a?a:this.fc.fa()};tf.prototype.next=function(){if(this.i<this.Tb){var a=Vc(this.Bc,this.i);this.i+=1;return new X(null,2,5,Y,[a,ab.b(this.Jc,a)],null)}return this.fc.next()};
tf.prototype.remove=function(){return Error("Unsupported operation")};function uf(a){this.C=a}uf.prototype.next=function(){if(null!=this.C){var a=M(this.C),b=V(a,0),a=V(a,1);this.C=P(this.C);return{value:[b,a],done:!1}}return{value:null,done:!0}};function vf(a){return new uf(L(a))}function wf(a){this.C=a}wf.prototype.next=function(){if(null!=this.C){var a=M(this.C);this.C=P(this.C);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function xf(a,b){var c;if(b instanceof w)a:{c=a.length;for(var d=b.ta,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof w&&d===a[e].ta){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof F)a:for(c=a.length,d=b.Da,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof F&&d===a[e].Da){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(I.b(b,a[d])){c=d;break a}d+=2}return c}yf;function zf(a,b,c){this.f=a;this.i=b;this.ja=c;this.h=32374990;this.w=0}g=zf.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.ja};g.da=function(){return this.i<this.f.length-2?new zf(this.f,this.i+2,this.ja):null};g.X=function(){return(this.f.length-this.i)/2};g.P=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};
g.Y=function(){return Ac(O,this.ja)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return new X(null,2,5,Y,[this.f[this.i],this.f[this.i+1]],null)};g.ea=function(){return this.i<this.f.length-2?new zf(this.f,this.i+2,this.ja):O};g.V=function(){return this};g.O=function(a,b){return new zf(this.f,this.i,b)};g.W=function(a,b){return Q(b,this)};zf.prototype[Ka]=function(){return qc(this)};Af;Bf;function Cf(a,b,c){this.f=a;this.i=b;this.j=c}
Cf.prototype.fa=function(){return this.i<this.j};Cf.prototype.next=function(){var a=new X(null,2,5,Y,[this.f[this.i],this.f[this.i+1]],null);this.i+=2;return a};function t(a,b,c,d){this.m=a;this.j=b;this.f=c;this.s=d;this.h=16647951;this.w=8196}g=t.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(Af.a?Af.a(this):Af.call(null,this))};g.entries=function(){return vf(L(this))};
g.values=function(){return qc(Bf.a?Bf.a(this):Bf.call(null,this))};g.has=function(a){return od(this,a)};g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.T(null,e),h=V(f,0),f=V(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))id(b)?(c=Qb(b),b=Sb(b),h=c,d=U(c),c=h):(c=M(b),h=V(c,0),f=V(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return ab.c(this,b,null)};
g.H=function(a,b,c){a=xf(this.f,b);return-1===a?c:this.f[a+1]};g.sa=function(){return new Cf(this.f,0,2*this.j)};g.N=function(){return this.m};g.X=function(){return this.j};g.P=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){if(null!=b&&(b.h&1024||b.pc)){var c=this.f.length;if(this.j===b.X(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],ld);if(e!==ld)if(I.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return sf(this,b)};
g.jb=function(){return new yf({},this.f.length,La(this.f))};g.Y=function(){return rb(ie,this.m)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Bb=function(a,b){if(0<=xf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Pa(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new t(this.m,this.j-1,d,null);I.b(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
g.Va=function(a,b,c){a=xf(this.f,b);if(-1===a){if(this.j<Df){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new t(this.m,this.j+1,e,null)}return rb(db(Ke(Yc,this),b,c),this.m)}if(c===this.f[a+1])return this;b=La(this.f);b[a+1]=c;return new t(this.m,this.j,b,null)};g.Lb=function(a,b){return-1!==xf(this.f,b)};g.V=function(){var a=this.f;return 0<=a.length-2?new zf(a,0,null):null};g.O=function(a,b){return new t(b,this.j,this.f,this.s)};
g.W=function(a,b){if(fd(b))return db(this,D.b(b,0),D.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=M(d);if(fd(e))c=db(c,D.b(e,0),D.b(e,1)),d=P(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ie=new t(null,0,[],xc),Df=8;t.prototype[Ka]=function(){return qc(this)};
Ef;function yf(a,b,c){this.lb=a;this.fb=b;this.f=c;this.h=258;this.w=56}g=yf.prototype;g.X=function(){if(v(this.lb))return Cd(this.fb);throw Error("count after persistent!");};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){if(v(this.lb))return a=xf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.ab=function(a,b){if(v(this.lb)){if(null!=b?b.h&2048||b.qc||(b.h?0:x(hb,b)):x(hb,b))return Lb(this,Gd.a?Gd.a(b):Gd.call(null,b),Hd.a?Hd.a(b):Hd.call(null,b));for(var c=L(b),d=this;;){var e=M(c);if(v(e))c=P(c),d=Lb(d,Gd.a?Gd.a(e):Gd.call(null,e),Hd.a?Hd.a(e):Hd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.kb=function(){if(v(this.lb))return this.lb=!1,new t(null,Cd(this.fb),this.f,null);throw Error("persistent! called twice");};
g.tb=function(a,b,c){if(v(this.lb)){a=xf(this.f,b);if(-1===a){if(this.fb+2<=2*Df)return this.fb+=2,this.f.push(b),this.f.push(c),this;a=Ef.b?Ef.b(this.fb,this.f):Ef.call(null,this.fb,this.f);return Lb(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Ff;Wc;function Ef(a,b){for(var c=Ib(Yc),d=0;;)if(d<a)c=Lb(c,b[d],b[d+1]),d+=2;else return c}function Gf(){this.F=!1}Hf;If;ue;Jf;re;Cc;function Kf(a,b){return a===b?!0:Od(a,b)?!0:I.b(a,b)}
function Lf(a,b,c){a=La(a);a[b]=c;return a}function Mf(a,b){var c=Array(a.length-2);kd(a,0,c,0,2*b);kd(a,2*(b+1),c,2*b,c.length-2*b);return c}function Nf(a,b,c,d){a=a.eb(b);a.f[c]=d;return a}Of;function Pf(a,b,c,d){this.f=a;this.i=b;this.yb=c;this.wa=d}Pf.prototype.advance=function(){for(var a=this.f.length;;)if(this.i<a){var b=this.f[this.i],c=this.f[this.i+1];null!=b?b=this.yb=new X(null,2,5,Y,[b,c],null):null!=c?(b=Wb(c),b=b.fa()?this.wa=b:!1):b=!1;this.i+=2;if(b)return!0}else return!1};
Pf.prototype.fa=function(){var a=null!=this.yb;return a?a:(a=null!=this.wa)?a:this.advance()};Pf.prototype.next=function(){if(null!=this.yb){var a=this.yb;this.yb=null;return a}if(null!=this.wa)return a=this.wa.next(),this.wa.fa()||(this.wa=null),a;if(this.advance())return this.next();throw Error("No such element");};Pf.prototype.remove=function(){return Error("Unsupported operation")};function Qf(a,b,c){this.M=a;this.R=b;this.f=c}g=Qf.prototype;
g.eb=function(a){if(a===this.M)return this;var b=Dd(this.R),c=Array(0>b?4:2*(b+1));kd(this.f,0,c,0,2*b);return new Qf(a,this.R,c)};g.wb=function(){return Hf.a?Hf.a(this.f):Hf.call(null,this.f)};g.Xa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.R&e))return d;var f=Dd(this.R&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Xa(a+5,b,c,d):Kf(c,e)?f:d};
g.va=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=Dd(this.R&h-1);if(0===(this.R&h)){var l=Dd(this.R);if(2*l<this.f.length){a=this.eb(a);b=a.f;f.F=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.R|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Rf.va(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.R>>>d&1)&&(k[d]=null!=this.f[e]?Rf.va(a,b+5,jc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Of(a,l+1,k)}b=Array(2*(l+4));kd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;kd(this.f,2*k,b,2*(k+1),2*(l-k));f.F=!0;a=this.eb(a);a.f=b;a.R|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.va(a,b+5,c,d,e,f),l===h?this:Nf(this,a,2*k+1,l);if(Kf(d,l))return e===h?this:Nf(this,a,2*k+1,e);f.F=!0;f=b+5;d=Jf.qa?Jf.qa(a,f,l,h,c,d,e):Jf.call(null,a,f,l,h,c,d,e);e=2*
k;k=2*k+1;a=this.eb(a);a.f[e]=null;a.f[k]=d;return a};
g.ua=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=Dd(this.R&f-1);if(0===(this.R&f)){var k=Dd(this.R);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Rf.ua(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.R>>>c&1)&&(h[c]=null!=this.f[d]?Rf.ua(a+5,jc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Of(null,k+1,h)}a=Array(2*(k+1));kd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;kd(this.f,2*h,a,2*(h+1),2*(k-h));e.F=!0;return new Qf(null,this.R|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.ua(a+5,b,c,d,e),k===f?this:new Qf(null,this.R,Lf(this.f,2*h+1,k));if(Kf(c,l))return d===f?this:new Qf(null,this.R,Lf(this.f,2*h+1,d));e.F=!0;e=this.R;k=this.f;a+=5;a=Jf.pa?Jf.pa(a,l,f,b,c,d):Jf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=La(k);d[c]=null;d[h]=a;return new Qf(null,e,d)};
g.xb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.R&d))return this;var e=Dd(this.R&d-1),f=this.f[2*e],h=this.f[2*e+1];return null==f?(a=h.xb(a+5,b,c),a===h?this:null!=a?new Qf(null,this.R,Lf(this.f,2*e+1,a)):this.R===d?null:new Qf(null,this.R^d,Mf(this.f,e))):Kf(c,f)?new Qf(null,this.R^d,Mf(this.f,e)):this};g.sa=function(){return new Pf(this.f,0,null,null)};var Rf=new Qf(null,0,[]);function Sf(a,b,c){this.f=a;this.i=b;this.wa=c}
Sf.prototype.fa=function(){for(var a=this.f.length;;){if(null!=this.wa&&this.wa.fa())return!0;if(this.i<a){var b=this.f[this.i];this.i+=1;null!=b&&(this.wa=Wb(b))}else return!1}};Sf.prototype.next=function(){if(this.fa())return this.wa.next();throw Error("No such element");};Sf.prototype.remove=function(){return Error("Unsupported operation")};function Of(a,b,c){this.M=a;this.j=b;this.f=c}g=Of.prototype;g.eb=function(a){return a===this.M?this:new Of(a,this.j,La(this.f))};
g.wb=function(){return If.a?If.a(this.f):If.call(null,this.f)};g.Xa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Xa(a+5,b,c,d):d};g.va=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=Nf(this,a,h,Rf.va(a,b+5,c,d,e,f)),a.j+=1,a;b=k.va(a,b+5,c,d,e,f);return b===k?this:Nf(this,a,h,b)};
g.ua=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new Of(null,this.j+1,Lf(this.f,f,Rf.ua(a+5,b,c,d,e)));a=h.ua(a+5,b,c,d,e);return a===h?this:new Of(null,this.j,Lf(this.f,f,a))};
g.xb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.xb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.j)a:{e=this.f;a=e.length;b=Array(2*(this.j-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new Qf(null,h,b);break a}}else d=new Of(null,this.j-1,Lf(this.f,d,a));else d=new Of(null,this.j,Lf(this.f,d,a));return d}return this};g.sa=function(){return new Sf(this.f,0,null)};
function Tf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Kf(c,a[d]))return d;d+=2}else return-1}function Uf(a,b,c,d){this.M=a;this.Ta=b;this.j=c;this.f=d}g=Uf.prototype;g.eb=function(a){if(a===this.M)return this;var b=Array(2*(this.j+1));kd(this.f,0,b,0,2*this.j);return new Uf(a,this.Ta,this.j,b)};g.wb=function(){return Hf.a?Hf.a(this.f):Hf.call(null,this.f)};g.Xa=function(a,b,c,d){a=Tf(this.f,this.j,c);return 0>a?d:Kf(c,this.f[a])?this.f[a+1]:d};
g.va=function(a,b,c,d,e,f){if(c===this.Ta){b=Tf(this.f,this.j,d);if(-1===b){if(this.f.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.eb(a),a.f[b]=d,a.f[c]=e,f.F=!0,a.j+=1,a;c=this.f.length;b=Array(c+2);kd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.F=!0;d=this.j+1;a===this.M?(this.f=b,this.j=d,a=this):a=new Uf(this.M,this.Ta,d,b);return a}return this.f[b+1]===e?this:Nf(this,a,b+1,e)}return(new Qf(a,1<<(this.Ta>>>b&31),[null,this,null,null])).va(a,b,c,d,e,f)};
g.ua=function(a,b,c,d,e){return b===this.Ta?(a=Tf(this.f,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),kd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.F=!0,new Uf(null,this.Ta,this.j+1,b)):I.b(this.f[a],d)?this:new Uf(null,this.Ta,this.j,Lf(this.f,a+1,d))):(new Qf(null,1<<(this.Ta>>>a&31),[null,this])).ua(a,b,c,d,e)};g.xb=function(a,b,c){a=Tf(this.f,this.j,c);return-1===a?this:1===this.j?null:new Uf(null,this.Ta,this.j-1,Mf(this.f,Cd(a)))};g.sa=function(){return new Pf(this.f,0,null,null)};
var Jf=function Jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Jf.pa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Jf.qa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Jf.pa=function(a,b,c,d,e,f){var h=jc(b);if(h===d)return new Uf(null,h,2,[b,c,e,f]);var k=new Gf;return Rf.ua(a,h,b,c,k).ua(a,d,e,f,k)};Jf.qa=function(a,b,c,d,e,f,h){var k=jc(c);if(k===e)return new Uf(null,k,2,[c,d,f,h]);var l=new Gf;return Rf.va(a,b,k,c,d,l).va(a,b,e,f,h,l)};Jf.u=7;function Vf(a,b,c,d,e){this.m=a;this.Ya=b;this.i=c;this.C=d;this.s=e;this.h=32374860;this.w=0}g=Vf.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return null==this.C?new X(null,2,5,Y,[this.Ya[this.i],this.Ya[this.i+1]],null):M(this.C)};
g.ea=function(){if(null==this.C){var a=this.Ya,b=this.i+2;return Hf.c?Hf.c(a,b,null):Hf.call(null,a,b,null)}var a=this.Ya,b=this.i,c=P(this.C);return Hf.c?Hf.c(a,b,c):Hf.call(null,a,b,c)};g.V=function(){return this};g.O=function(a,b){return new Vf(b,this.Ya,this.i,this.C,this.s)};g.W=function(a,b){return Q(b,this)};Vf.prototype[Ka]=function(){return qc(this)};
var Hf=function Hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Hf.a(arguments[0]);case 3:return Hf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Hf.a=function(a){return Hf.c(a,0,null)};
Hf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Vf(null,a,b,null,null);var d=a[b+1];if(v(d)&&(d=d.wb(),v(d)))return new Vf(null,a,b+2,d,null);b+=2}else return null;else return new Vf(null,a,b,c,null)};Hf.u=3;function Wf(a,b,c,d,e){this.m=a;this.Ya=b;this.i=c;this.C=d;this.s=e;this.h=32374860;this.w=0}g=Wf.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.m};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return M(this.C)};g.ea=function(){var a=this.Ya,b=this.i,c=P(this.C);return If.A?If.A(null,a,b,c):If.call(null,null,a,b,c)};g.V=function(){return this};g.O=function(a,b){return new Wf(b,this.Ya,this.i,this.C,this.s)};g.W=function(a,b){return Q(b,this)};
Wf.prototype[Ka]=function(){return qc(this)};var If=function If(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return If.a(arguments[0]);case 4:return If.A(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};If.a=function(a){return If.A(null,a,0,null)};
If.A=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(v(e)&&(e=e.wb(),v(e)))return new Wf(a,b,c+1,e,null);c+=1}else return null;else return new Wf(a,b,c,d,null)};If.u=4;Ff;function Xf(a,b,c){this.ma=a;this.gc=b;this.Sb=c}Xf.prototype.fa=function(){return this.Sb&&this.gc.fa()};Xf.prototype.next=function(){if(this.Sb)return this.gc.next();this.Sb=!0;return this.ma};Xf.prototype.remove=function(){return Error("Unsupported operation")};
function Wc(a,b,c,d,e,f){this.m=a;this.j=b;this.root=c;this.ga=d;this.ma=e;this.s=f;this.h=16123663;this.w=8196}g=Wc.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(Af.a?Af.a(this):Af.call(null,this))};g.entries=function(){return vf(L(this))};g.values=function(){return qc(Bf.a?Bf.a(this):Bf.call(null,this))};g.has=function(a){return od(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.T(null,e),h=V(f,0),f=V(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))id(b)?(c=Qb(b),b=Sb(b),h=c,d=U(c),c=h):(c=M(b),h=V(c,0),f=V(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return null==b?this.ga?this.ma:c:null==this.root?c:this.root.Xa(0,jc(b),b,c)};
g.sa=function(){var a=this.root?Wb(this.root):de;return this.ga?new Xf(this.ma,a,!1):a};g.N=function(){return this.m};g.X=function(){return this.j};g.P=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return sf(this,b)};g.jb=function(){return new Ff({},this.root,this.j,this.ga,this.ma)};g.Y=function(){return rb(Yc,this.m)};
g.Bb=function(a,b){if(null==b)return this.ga?new Wc(this.m,this.j-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.xb(0,jc(b),b);return c===this.root?this:new Wc(this.m,this.j-1,c,this.ga,this.ma,null)};g.Va=function(a,b,c){if(null==b)return this.ga&&c===this.ma?this:new Wc(this.m,this.ga?this.j:this.j+1,this.root,!0,c,null);a=new Gf;b=(null==this.root?Rf:this.root).ua(0,jc(b),b,c,a);return b===this.root?this:new Wc(this.m,a.F?this.j+1:this.j,b,this.ga,this.ma,null)};
g.Lb=function(a,b){return null==b?this.ga:null==this.root?!1:this.root.Xa(0,jc(b),b,ld)!==ld};g.V=function(){if(0<this.j){var a=null!=this.root?this.root.wb():null;return this.ga?Q(new X(null,2,5,Y,[null,this.ma],null),a):a}return null};g.O=function(a,b){return new Wc(b,this.j,this.root,this.ga,this.ma,this.s)};
g.W=function(a,b){if(fd(b))return db(this,D.b(b,0),D.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=M(d);if(fd(e))c=db(c,D.b(e,0),D.b(e,1)),d=P(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Yc=new Wc(null,0,null,!1,null,xc);Wc.prototype[Ka]=function(){return qc(this)};
function Ff(a,b,c,d,e){this.M=a;this.root=b;this.count=c;this.ga=d;this.ma=e;this.h=258;this.w=56}function Yf(a,b,c){if(a.M){if(null==b)a.ma!==c&&(a.ma=c),a.ga||(a.count+=1,a.ga=!0);else{var d=new Gf;b=(null==a.root?Rf:a.root).va(a.M,0,jc(b),b,c,d);b!==a.root&&(a.root=b);d.F&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=Ff.prototype;g.X=function(){if(this.M)return this.count;throw Error("count after persistent!");};
g.K=function(a,b){return null==b?this.ga?this.ma:null:null==this.root?null:this.root.Xa(0,jc(b),b)};g.H=function(a,b,c){return null==b?this.ga?this.ma:c:null==this.root?c:this.root.Xa(0,jc(b),b,c)};
g.ab=function(a,b){var c;a:if(this.M)if(null!=b?b.h&2048||b.qc||(b.h?0:x(hb,b)):x(hb,b))c=Yf(this,Gd.a?Gd.a(b):Gd.call(null,b),Hd.a?Hd.a(b):Hd.call(null,b));else{c=L(b);for(var d=this;;){var e=M(c);if(v(e))c=P(c),d=Yf(d,Gd.a?Gd.a(e):Gd.call(null,e),Hd.a?Hd.a(e):Hd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.kb=function(){var a;if(this.M)this.M=null,a=new Wc(null,this.count,this.root,this.ga,this.ma,null);else throw Error("persistent! called twice");return a};
g.tb=function(a,b,c){return Yf(this,b,c)};Zf;$f;function $f(a,b,c,d,e){this.key=a;this.F=b;this.left=c;this.right=d;this.s=e;this.h=32402207;this.w=0}g=$f.prototype;g.replace=function(a,b,c,d){return new $f(a,b,c,d,null)};g.K=function(a,b){return D.c(this,b,null)};g.H=function(a,b,c){return D.c(this,b,c)};g.T=function(a,b){return 0===b?this.key:1===b?this.F:null};g.ka=function(a,b,c){return 0===b?this.key:1===b?this.F:c};
g.bb=function(a,b,c){return(new X(null,2,5,Y,[this.key,this.F],null)).bb(null,b,c)};g.N=function(){return null};g.X=function(){return 2};g.rb=function(){return this.key};g.sb=function(){return this.F};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Sc};g.$=function(a,b){return Gc(this,b)};g.aa=function(a,b,c){return Hc(this,b,c)};g.Va=function(a,b,c){return Xc.c(new X(null,2,5,Y,[this.key,this.F],null),b,c)};
g.V=function(){return Ta(Ta(O,this.F),this.key)};g.O=function(a,b){return Ac(new X(null,2,5,Y,[this.key,this.F],null),b)};g.W=function(a,b){return new X(null,3,5,Y,[this.key,this.F,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();
g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};$f.prototype[Ka]=function(){return qc(this)};function Zf(a,b,c,d,e){this.key=a;this.F=b;this.left=c;this.right=d;this.s=e;this.h=32402207;this.w=0}g=Zf.prototype;g.replace=function(a,b,c,d){return new Zf(a,b,c,d,null)};g.K=function(a,b){return D.c(this,b,null)};g.H=function(a,b,c){return D.c(this,b,c)};
g.T=function(a,b){return 0===b?this.key:1===b?this.F:null};g.ka=function(a,b,c){return 0===b?this.key:1===b?this.F:c};g.bb=function(a,b,c){return(new X(null,2,5,Y,[this.key,this.F],null)).bb(null,b,c)};g.N=function(){return null};g.X=function(){return 2};g.rb=function(){return this.key};g.sb=function(){return this.F};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Sc};g.$=function(a,b){return Gc(this,b)};
g.aa=function(a,b,c){return Hc(this,b,c)};g.Va=function(a,b,c){return Xc.c(new X(null,2,5,Y,[this.key,this.F],null),b,c)};g.V=function(){return Ta(Ta(O,this.F),this.key)};g.O=function(a,b){return Ac(new X(null,2,5,Y,[this.key,this.F],null),b)};g.W=function(a,b){return new X(null,3,5,Y,[this.key,this.F,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Zf.prototype[Ka]=function(){return qc(this)};Gd;
var yc=function yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return yc.l(0<c.length?new K(c.slice(0),0):null)};yc.l=function(a){for(var b=L(a),c=Ib(Yc);;)if(b){a=P(P(b));var d=M(b),b=M(P(b)),c=Lb(c,d,b),b=a}else return Kb(c)};yc.u=0;yc.B=function(a){return yc.l(L(a))};function ag(a,b){this.D=a;this.ja=b;this.h=32374988;this.w=0}g=ag.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.ja};
g.da=function(){var a=(null!=this.D?this.D.h&128||this.D.Cb||(this.D.h?0:x(Za,this.D)):x(Za,this.D))?this.D.da(null):P(this.D);return null==a?null:new ag(a,this.ja)};g.P=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.ja)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return this.D.Z(null).rb(null)};
g.ea=function(){var a=(null!=this.D?this.D.h&128||this.D.Cb||(this.D.h?0:x(Za,this.D)):x(Za,this.D))?this.D.da(null):P(this.D);return null!=a?new ag(a,this.ja):O};g.V=function(){return this};g.O=function(a,b){return new ag(this.D,b)};g.W=function(a,b){return Q(b,this)};ag.prototype[Ka]=function(){return qc(this)};function Af(a){return(a=L(a))?new ag(a,null):null}function Gd(a){return ib(a)}function bg(a,b){this.D=a;this.ja=b;this.h=32374988;this.w=0}g=bg.prototype;g.toString=function(){return Yb(this)};
g.equiv=function(a){return this.v(null,a)};g.N=function(){return this.ja};g.da=function(){var a=(null!=this.D?this.D.h&128||this.D.Cb||(this.D.h?0:x(Za,this.D)):x(Za,this.D))?this.D.da(null):P(this.D);return null==a?null:new bg(a,this.ja)};g.P=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.ja)};g.$=function(a,b){return R.b(b,this)};g.aa=function(a,b,c){return R.c(b,c,this)};g.Z=function(){return this.D.Z(null).sb(null)};
g.ea=function(){var a=(null!=this.D?this.D.h&128||this.D.Cb||(this.D.h?0:x(Za,this.D)):x(Za,this.D))?this.D.da(null):P(this.D);return null!=a?new bg(a,this.ja):O};g.V=function(){return this};g.O=function(a,b){return new bg(this.D,b)};g.W=function(a,b){return Q(b,this)};bg.prototype[Ka]=function(){return qc(this)};function Bf(a){return(a=L(a))?new bg(a,null):null}function Hd(a){return jb(a)}cg;function dg(a){this.nb=a}dg.prototype.fa=function(){return this.nb.fa()};
dg.prototype.next=function(){if(this.nb.fa())return this.nb.next().J[0];throw Error("No such element");};dg.prototype.remove=function(){return Error("Unsupported operation")};function eg(a,b,c){this.m=a;this.Wa=b;this.s=c;this.h=15077647;this.w=8196}g=eg.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(L(this))};g.entries=function(){var a=L(this);return new wf(L(a))};g.values=function(){return qc(L(this))};
g.has=function(a){return od(this,a)};g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.T(null,e),h=V(f,0),f=V(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))id(b)?(c=Qb(b),b=Sb(b),h=c,d=U(c),c=h):(c=M(b),h=V(c,0),f=V(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return ab.c(this,b,null)};g.H=function(a,b,c){return bb(this.Wa,b)?b:c};g.sa=function(){return new dg(Wb(this.Wa))};g.N=function(){return this.m};g.X=function(){return Oa(this.Wa)};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=wc(this)};g.v=function(a,b){return cd(b)&&U(this)===U(b)&&le(function(a){return function(b){return od(a,b)}}(this),b)};g.jb=function(){return new cg(Ib(this.Wa))};g.Y=function(){return Ac(fg,this.m)};g.Yb=function(a,b){return new eg(this.m,gb(this.Wa,b),null)};g.V=function(){return Af(this.Wa)};g.O=function(a,b){return new eg(b,this.Wa,this.s)};g.W=function(a,b){return new eg(this.m,Xc.c(this.Wa,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var fg=new eg(null,ie,xc);
function gg(a){var b=a.length;if(b<=Df)for(var c=0,d=Ib(ie);;)if(c<b)var e=c+1,d=Lb(d,a[c],null),c=e;else return new eg(null,Kb(d),null);else for(c=0,d=Ib(fg);;)if(c<b)e=c+1,d=Jb(d,a[c]),c=e;else return Kb(d)}eg.prototype[Ka]=function(){return qc(this)};function cg(a){this.Ua=a;this.w=136;this.h=259}g=cg.prototype;g.ab=function(a,b){this.Ua=Lb(this.Ua,b,null);return this};g.kb=function(){return new eg(null,Kb(this.Ua),null)};g.X=function(){return U(this.Ua)};g.K=function(a,b){return ab.c(this,b,null)};
g.H=function(a,b,c){return ab.c(this.Ua,b,ld)===ld?c:b};g.call=function(){function a(a,b,c){return ab.c(this.Ua,b,ld)===ld?c:b}function b(a,b){return ab.c(this.Ua,b,ld)===ld?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(La(b)))};g.a=function(a){return ab.c(this.Ua,a,ld)===ld?null:a};
g.b=function(a,b){return ab.c(this.Ua,a,ld)===ld?b:a};function hg(a){a=L(a);if(null==a)return fg;if(a instanceof K&&0===a.i){a=a.f;a:for(var b=0,c=Ib(fg);;)if(b<a.length)var d=b+1,c=c.ab(null,a[b]),b=d;else break a;return c.kb(null)}for(d=Ib(fg);;)if(null!=a)b=P(a),d=d.ab(null,a.Z(null)),a=b;else return Kb(d)}function Fd(a){if(null!=a&&(a.w&4096||a.sc))return a.name;if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
function ig(a,b,c){this.i=a;this.end=b;this.step=c}ig.prototype.fa=function(){return 0<this.step?this.i<this.end:this.i>this.end};ig.prototype.next=function(){var a=this.i;this.i+=this.step;return a};function jg(a,b,c,d,e){this.m=a;this.start=b;this.end=c;this.step=d;this.s=e;this.h=32375006;this.w=8192}g=jg.prototype;g.toString=function(){return Yb(this)};g.equiv=function(a){return this.v(null,a)};
g.T=function(a,b){if(b<Oa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.ka=function(a,b,c){return b<Oa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.sa=function(){return new ig(this.start,this.end,this.step)};g.N=function(){return this.m};
g.da=function(){return 0<this.step?this.start+this.step<this.end?new jg(this.m,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new jg(this.m,this.start+this.step,this.end,this.step,null):null};g.X=function(){return Ha(yb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(O,this.m)};g.$=function(a,b){return Gc(this,b)};
g.aa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Fc(c))return Cc.a?Cc.a(c):Cc.call(null,c);a+=this.step}else return c};g.Z=function(){return null==yb(this)?null:this.start};g.ea=function(){return null!=yb(this)?new jg(this.m,this.start+this.step,this.end,this.step,null):O};g.V=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.O=function(a,b){return new jg(b,this.start,this.end,this.step,this.s)};g.W=function(a,b){return Q(b,this)};jg.prototype[Ka]=function(){return qc(this)};function kg(a,b){return new jg(null,a,b,1,null)}
function lg(a,b){return function(){function c(c,d,e){return new X(null,2,5,Y,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new X(null,2,5,Y,[a.b?a.b(c,d):a.call(null,c,d),b.b?b.b(c,d):b.call(null,c,d)],null)}function e(c){return new X(null,2,5,Y,[a.a?a.a(c):a.call(null,c),b.a?b.a(c):b.call(null,c)],null)}function f(){return new X(null,2,5,Y,[a.o?a.o():a.call(null),b.o?b.o():b.call(null)],null)}var h=null,k=function(){function c(a,b,e,f){var h=null;
if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new K(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){return new X(null,2,5,Y,[C.I(a,c,e,f,h),C.I(b,c,e,f,h)],null)}c.u=3;c.B=function(a){var b=M(a);a=P(a);var c=M(a);a=P(a);var e=M(a);a=N(a);return d(b,c,e,a)};c.l=d;return c}(),h=function(a,b,h,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var q=
null;if(3<arguments.length){for(var q=0,u=Array(arguments.length-3);q<u.length;)u[q]=arguments[q+3],++q;q=new K(u,0)}return k.l(a,b,h,q)}throw Error("Invalid arity: "+arguments.length);};h.u=3;h.B=k.B;h.o=f;h.a=e;h.b=d;h.c=c;h.l=k.l;return h}()}
function ff(a,b,c,d,e,f,h){var k=ta;ta=null==ta?null:ta-1;try{if(null!=ta&&0>ta)return Db(a,"#");Db(a,c);if(0===Ca.a(f))L(h)&&Db(a,function(){var a=mg.a(f);return v(a)?a:"..."}());else{if(L(h)){var l=M(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=P(h),n=Ca.a(f)-1;;)if(!m||null!=n&&0===n){L(m)&&0===n&&(Db(a,d),Db(a,function(){var a=mg.a(f);return v(a)?a:"..."}()));break}else{Db(a,d);var r=M(m);c=a;h=f;b.c?b.c(r,c,h):b.call(null,r,c,h);var q=P(m);c=n-1;m=q;n=c}}return Db(a,e)}finally{ta=k}}
function ng(a,b){for(var c=L(b),d=null,e=0,f=0;;)if(f<e){var h=d.T(null,f);Db(a,h);f+=1}else if(c=L(c))d=c,id(d)?(c=Qb(d),e=Sb(d),d=c,h=U(c),c=e,e=h):(h=M(d),Db(a,h),c=P(d),d=null,e=0),f=0;else return null}var og={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function pg(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return og[a]})),A('"')].join("")}qg;
function rg(a,b){var c=nd(J.b(a,Aa));return c?(c=null!=b?b.h&131072||b.rc?!0:!1:!1)?null!=ad(b):c:c}
function sg(a,b,c){if(null==a)return Db(b,"nil");if(rg(c,a)){Db(b,"^");var d=ad(a);Z.c?Z.c(d,b,c):Z.call(null,d,b,c);Db(b," ")}if(a.ub)return a.Gb(a,b,c);if(null!=a&&(a.h&2147483648||a.U))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Db(b,""+A(a));if(null!=a&&a.constructor===Object)return Db(b,"#js "),d=W.b(function(b){return new X(null,2,5,Y,[Pd.a(b),a[b]],null)},jd(a)),qg.A?qg.A(d,Z,b,c):qg.call(null,d,Z,b,c);if(Ga(a))return ff(b,Z,"#js ["," ","]",c,a);if("string"==typeof a)return v(za.a(c))?
Db(b,pg(a)):Db(b,a);if("function"==p(a)){var e=a.name;c=v(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return ng(b,nc(["#object[",c,' "',""+A(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+A(a);;)if(U(c)<b)c=[A("0"),A(c)].join("");else return c},ng(b,nc(['#inst "',""+A(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(a instanceof RegExp)return ng(b,nc(['#"',a.source,'"'],0));if(null!=a&&(a.h&2147483648||a.U))return Eb(a,b,c);if(v(a.constructor.cb))return ng(b,nc(["#object[",a.constructor.cb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=v(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return ng(b,nc(["#object[",c," ",""+A(a),"]"],0))}function Z(a,b,c){var d=tg.a(c);return v(d)?(c=Xc.c(c,ug,sg),d.c?d.c(a,b,c):d.call(null,a,b,c)):sg(a,b,c)}
function vg(a,b){var c;if(null==a||Ha(L(a)))c="";else{c=A;var d=new ja;a:{var e=new Xb(d);Z(M(a),e,b);for(var f=L(P(a)),h=null,k=0,l=0;;)if(l<k){var m=h.T(null,l);Db(e," ");Z(m,e,b);l+=1}else if(f=L(f))h=f,id(h)?(f=Qb(h),k=Sb(h),h=f,m=U(f),f=k,k=m):(m=M(h),Db(e," "),Z(m,e,b),f=P(h),h=null,k=0),l=0;else break a}c=""+c(d)}return c}var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return te.l(0<c.length?new K(c.slice(0),0):null)};
te.l=function(a){return vg(a,va())};te.u=0;te.B=function(a){return te.l(L(a))};function wg(a){var b=Xc.c(va(),za,!1);a=vg(a,b);oa.a?oa.a(a):oa.call(null,a);v(sa)&&(a=va(),oa.a?oa.a("\n"):oa.call(null,"\n"),J.b(a,ya))}function qg(a,b,c,d){return ff(c,function(a,c,d){var k=ib(a);b.c?b.c(k,c,d):b.call(null,k,c,d);Db(c," ");a=jb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,L(a))}ye.prototype.U=!0;
ye.prototype.L=function(a,b,c){Db(b,"#object [cljs.core.Volatile ");Z(new t(null,1,[xg,this.state],null),b,c);return Db(b,"]")};K.prototype.U=!0;K.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Qd.prototype.U=!0;Qd.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Vf.prototype.U=!0;Vf.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};$f.prototype.U=!0;$f.prototype.L=function(a,b,c){return ff(b,Z,"["," ","]",c,this)};zf.prototype.U=!0;
zf.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};sc.prototype.U=!0;sc.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};hd.prototype.U=!0;hd.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Md.prototype.U=!0;Md.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Mc.prototype.U=!0;Mc.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Wc.prototype.U=!0;Wc.prototype.L=function(a,b,c){return qg(this,Z,b,c)};Wf.prototype.U=!0;
Wf.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};nf.prototype.U=!0;nf.prototype.L=function(a,b,c){return ff(b,Z,"["," ","]",c,this)};eg.prototype.U=!0;eg.prototype.L=function(a,b,c){return ff(b,Z,"#{"," ","}",c,this)};gd.prototype.U=!0;gd.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};qe.prototype.U=!0;qe.prototype.L=function(a,b,c){Db(b,"#object [cljs.core.Atom ");Z(new t(null,1,[xg,this.state],null),b,c);return Db(b,"]")};bg.prototype.U=!0;
bg.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Zf.prototype.U=!0;Zf.prototype.L=function(a,b,c){return ff(b,Z,"["," ","]",c,this)};X.prototype.U=!0;X.prototype.L=function(a,b,c){return ff(b,Z,"["," ","]",c,this)};Kd.prototype.U=!0;Kd.prototype.L=function(a,b){return Db(b,"()")};je.prototype.U=!0;je.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};t.prototype.U=!0;t.prototype.L=function(a,b,c){return qg(this,Z,b,c)};jg.prototype.U=!0;
jg.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};ag.prototype.U=!0;ag.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};Nc.prototype.U=!0;Nc.prototype.L=function(a,b,c){return ff(b,Z,"("," ",")",c,this)};F.prototype.pb=!0;F.prototype.ib=function(a,b){if(b instanceof F)return lc(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};w.prototype.pb=!0;
w.prototype.ib=function(a,b){if(b instanceof w)return Nd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};nf.prototype.pb=!0;nf.prototype.ib=function(a,b){if(fd(b))return pd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};X.prototype.pb=!0;X.prototype.ib=function(a,b){if(fd(b))return pd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};var yg=null;
function zg(){null==yg&&(yg=re.a?re.a(0):re.call(null,0));return mc.a([A("cell"),A(xe.b(yg,Bc))].join(""))}function Ag(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Fc(d)?new Dc(d):d}}
function Ee(a){return function(b){return function(){function c(a,c){return Ma.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.o?a.o():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.o=e;f.a=d;f.b=c;return f}()}(Ag(a))}Bg;function Cg(){}
var Dg=function Dg(b){if(null!=b&&null!=b.mc)return b.mc(b);var c=Dg[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Dg._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("IEncodeJS.-clj-\x3ejs",b);};Eg;function Fg(a){return(null!=a?a.lc||(a.Ac?0:x(Cg,a)):x(Cg,a))?Dg(a):"string"===typeof a||"number"===typeof a||a instanceof w||a instanceof F?Eg.a?Eg.a(a):Eg.call(null,a):te.l(nc([a],0))}
var Eg=function Eg(b){if(null==b)return null;if(null!=b?b.lc||(b.Ac?0:x(Cg,b)):x(Cg,b))return Dg(b);if(b instanceof w)return Fd(b);if(b instanceof F)return""+A(b);if(ed(b)){var c={};b=L(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.T(null,f),k=V(h,0),h=V(h,1);c[Fg(k)]=Eg(h);f+=1}else if(b=L(b))id(b)?(e=Qb(b),b=Sb(b),d=e,e=U(e)):(e=M(b),d=V(e,0),e=V(e,1),c[Fg(d)]=Eg(e),b=P(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.h&8||b.Nc||(b.h?0:x(Qa,b)):x(Qa,b)){c=[];b=L(W.b(Eg,b));d=null;for(f=
e=0;;)if(f<e)k=d.T(null,f),c.push(k),f+=1;else if(b=L(b))d=b,id(d)?(b=Qb(d),f=Sb(d),d=b,e=U(b),b=f):(b=M(d),c.push(b),b=P(d),d=null,e=0),f=0;else break;return c}return b},Bg=function Bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Bg.o();case 1:return Bg.a(arguments[0]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Bg.o=function(){return Bg.a(1)};Bg.a=function(a){return Math.random()*a};Bg.u=1;
function Gg(a,b){return ae(Ma.c(function(b,d){var e=a.a?a.a(d):a.call(null,d),f=Rc.b(J.c(b,e,Sc),d);return Lb(b,e,f)},Ib(ie),b))};var Hg=new w(null,"y","y",-1757859776),Ig=new F(null,"itm","itm",-713282527,null),Kg=new F(null,".-length",".-length",-280799999,null),Lg=new w(null,"onchange","onchange",1355467329),Mg=new w(null,"min","min",444991522),Ng=new F(null,"meta18979","meta18979",1108931746,null),Og=new F(null,"puts","puts",-1883877054,null),Pg=new F(null,"\x3c","\x3c",993667236,null),Aa=new w(null,"meta","meta",1499536964),Qg=new F(null,"blockable","blockable",-28395259,null),Ba=new w(null,"dup","dup",556298533),Rg=new w(null,
"sand","sand",1204438373),Sg=new F(null,"shade","shade",70579077,null),Tg=new w(null,"private","private",-558947994),we=new F(null,"new-value","new-value",-1567397401,null),se=new w(null,"validator","validator",-1966190681),Ug=new w(null,"use","use",-1846382424),Vg=new w(null,"axes","axes",1970866440),Wg=new w(null,"default","default",-1987822328),Xg=new w(null,"finally-block","finally-block",832982472),Yg=new w(null,"grid","grid",402978600),Zg=new w(null,"columns","columns",1998437288),$g=new w(null,
"value","value",305978217),ah=new w(null,"wall","wall",-787661558),bh=new w(null,"width","width",-384071477),ch=new w(null,"onclick","onclick",1297553739),xg=new w(null,"val","val",128701612),dh=new w(null,"recur","recur",-437573268),eh=new w(null,"type","type",1174270348),fh=new w(null,"catch-block","catch-block",1175212748),ve=new F(null,"validate","validate",1439230700,null),gh=new w(null,"points","points",-1486596883),hh=new F(null,"\x3e","\x3e",1085014381,null),ug=new w(null,"fallback-impl",
"fallback-impl",-1501286995),ya=new w(null,"flush-on-newline","flush-on-newline",-151457939),ih=new w(null,"walls","walls",-268788818),jh=new w(null,"empty","empty",767870958),kh=new w(null,"className","className",-1983287057),lh=new w(null,"canvas","canvas",-1798817489),mh=new w(null,"size","size",1098693007),nh=new w(null,"shade-at","shade-at",-566931985),oh=new w(null,"no-op","no-op",-93046065),ph=new w(null,"column","column",2078222095),qh=new w(null,"rows","rows",850049680),Be=new F(null,"n",
"n",-2092305744,null),rh=new w(null,"div","div",1057191632),za=new w(null,"readably","readably",1129599760),sh=new F(null,"box","box",-1123515375,null),mg=new w(null,"more-marker","more-marker",-14717935),th=new w(null,"ocean","ocean",922720274),uh=new w(null,"shades","shades",-1764567342),vh=new F(null,"nil?","nil?",1612038930,null),wh=new F(null,"val","val",1769233139,null),xh=new F(null,"not","not",1044554643,null),yh=new F(null,"shade-\x3ecolor","shade-\x3ecolor",353466323,null),Ca=new w(null,
"print-length","print-length",1931866356),zh=new w(null,"max","max",61366548),Ah=new w(null,"label","label",1718410804),Bh=new w(null,"id","id",-1388402092),Ch=new w(null,"catch-exception","catch-exception",-1997306795),Dh=new w(null,"grass","grass",1213050421),Eh=new w(null,"prev","prev",-1597069226),Fh=new w(null,"shape","shape",1190694006),Gh=new w(null,"svg","svg",856789142),Hh=new F(null,"buf-or-n","buf-or-n",-1646815050,null),he=new F(null,"meta20058","meta20058",-1303014986,null),Ih=new w(null,
"continue-block","continue-block",-1852047850),Jh=new w(null,"dot-size","dot-size",-228271528),Kh=new F(null,"meta16111","meta16111",-1123533575,null),Lh=new w(null,"x","x",2099068185),Mh=new w(null,"outcrop","outcrop",1711447801),Nh=new w(null,"input","input",556931961),Qe=new w(null,"cells","cells",-985166822),ge=new F(null,"quote","quote",1377916282,null),fe=new w(null,"arglists","arglists",1661989754),ee=new F(null,"nil-iter","nil-iter",1101030523,null),Oh=new w(null,"adjacents","adjacents",1005716955),
Ph=new w(null,"water","water",-824098213),Qh=new F(null,"meta18916","meta18916",-539423013,null),tg=new w(null,"alt-impl","alt-impl",670969595),Rh=new w(null,"rock","rock",946709275),Sh=new F(null,"fn-handler","fn-handler",648785851,null),Th=new w(null,"hookDraw","hookDraw",1093451932),Uh=new w(null,"using","using",1948623036),Vh=new F(null,"takes","takes",298247964,null),Wh=new F("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null),Xh=new w(null,"shade","shade",-1569952450),Ae=new F(null,
"number?","number?",-1747282210,null),Yh=new w(null,"height","height",1025178622),Zh=new w(null,"row","row",-570139521),$h=new w(null,"trees","trees",-521947809),ai=new w(null,"foreignObject","foreignObject",25502111),bi=new w(null,"show","show",-576705889),ci=new F(null,"f","f",43394975,null);var di,ei=function ei(b,c){if(null!=b&&null!=b.Qb)return b.Qb(0,c);var d=ei[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ei._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("ReadPort.take!",b);},fi=function fi(b,c,d){if(null!=b&&null!=b.Fb)return b.Fb(0,c,d);var e=fi[p(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=fi._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw y("WritePort.put!",b);},gi=function gi(b){if(null!=b&&null!=b.Eb)return b.Eb();
var c=gi[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gi._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("Channel.close!",b);},hi=function hi(b){if(null!=b&&null!=b.dc)return!0;var c=hi[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=hi._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("Handler.active?",b);},ii=function ii(b){if(null!=b&&null!=b.ec)return b.la;var c=ii[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ii._;if(null!=c)return c.a?
c.a(b):c.call(null,b);throw y("Handler.commit",b);},ki=function ki(b,c){if(null!=b&&null!=b.cc)return b.cc(0,c);var d=ki[p(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=ki._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw y("Buffer.add!*",b);},li=function li(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return li.a(arguments[0]);case 2:return li.b(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),
A(c.length)].join(""));}};li.a=function(a){return a};li.b=function(a,b){if(null==b)throw Error([A("Assert failed: "),A(te.l(nc([ec(xh,ec(vh,Ig))],0)))].join(""));return ki(a,b)};li.u=2;function mi(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function ni(a,b,c,d){this.head=a;this.J=b;this.length=c;this.f=d}ni.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.J];this.f[this.J]=null;this.J=(this.J+1)%this.f.length;--this.length;return a};ni.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function oi(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
ni.prototype.resize=function(){var a=Array(2*this.f.length);return this.J<this.head?(mi(this.f,this.J,a,0,this.length),this.J=0,this.head=this.length,this.f=a):this.J>this.head?(mi(this.f,this.J,a,0,this.f.length-this.J),mi(this.f,0,a,this.f.length-this.J,this.head),this.J=0,this.head=this.length,this.f=a):this.J===this.head?(this.head=this.J=0,this.f=a):null};function pi(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.a?b.a(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function qi(a){if(!(0<a))throw Error([A("Assert failed: "),A("Can't create a ring buffer of size 0"),A("\n"),A(te.l(nc([ec(hh,Be,0)],0)))].join(""));return new ni(0,0,0,Array(a))}function ri(a,b){this.G=a;this.n=b;this.h=2;this.w=0}function si(a){return a.G.length===a.n}ri.prototype.cc=function(a,b){oi(this.G,b);return this};ri.prototype.X=function(){return this.G.length};if("undefined"===typeof ti)var ti={};var ui;a:{var vi=aa.navigator;if(vi){var wi=vi.userAgent;if(wi){ui=wi;break a}}ui=""};var xi;
function yi(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==ui.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ha(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==ui.indexOf("Trident")&&-1==ui.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Vb;c.Vb=null;a()}};return function(a){d.next={Vb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var zi=qi(32),Ai=!1,Bi=!1;Ci;function Di(){Ai=!0;Bi=!1;for(var a=0;;){var b=zi.pop();if(null!=b&&(b.o?b.o():b.call(null),1024>a)){a+=1;continue}break}Ai=!1;return 0<zi.length?Ci.o?Ci.o():Ci.call(null):null}function Ci(){var a=Bi;if(v(v(a)?Ai:a))return null;Bi=!0;"function"!=p(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(xi||(xi=yi()),xi(Di)):aa.setImmediate(Di)}function Ei(a){oi(zi,a);Ci()};var Fi,Gi=function Gi(b){"undefined"===typeof Fi&&(Fi=function(b,d,e){this.ic=b;this.F=d;this.Gc=e;this.h=425984;this.w=0},Fi.prototype.O=function(b,d){return new Fi(this.ic,this.F,d)},Fi.prototype.N=function(){return this.Gc},Fi.prototype.qb=function(){return this.F},Fi.Rb=function(){return new X(null,3,5,Y,[Ac(sh,new t(null,1,[fe,ec(ge,ec(new X(null,1,5,Y,[wh],null)))],null)),wh,Ng],null)},Fi.ub=!0,Fi.cb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18978",Fi.Gb=function(b,d){return Db(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18978")});return new Fi(Gi,b,ie)};function Hi(a,b){this.vb=a;this.F=b}function Ii(a){return hi(a.vb)}var Ji=function Ji(b){if(null!=b&&null!=b.bc)return b.bc();var c=Ji[p(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ji._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw y("MMC.abort",b);};function Ki(a,b,c,d,e,f,h){this.gb=a;this.Ib=b;this.Za=c;this.Hb=d;this.G=e;this.closed=f;this.ra=h}
Ki.prototype.bc=function(){for(;;){var a=this.Za.pop();if(null!=a){var b=a.vb;Ei(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(b.la,b,a.F,a,this))}break}pi(this.Za,ne());return gi(this)};
Ki.prototype.Fb=function(a,b,c){var d=this;if(null==b)throw Error([A("Assert failed: "),A("Can't put nil in on a channel"),A("\n"),A(te.l(nc([ec(xh,ec(vh,wh))],0)))].join(""));if(a=d.closed)return Gi(!a);if(v(function(){var a=d.G;return v(a)?Ha(si(d.G)):a}())){for(c=Fc(d.ra.b?d.ra.b(d.G,b):d.ra.call(null,d.G,b));;){if(0<d.gb.length&&0<U(d.G)){var e=d.gb.pop(),f=e.la,h=d.G.G.pop();Ei(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(f,h,e,c,a,this))}break}c&&Ji(this);return Gi(!0)}e=
function(){for(;;){var a=d.gb.pop();if(v(a)){if(v(!0))return a}else return null}}();if(v(e))return c=ii(e),Ei(function(a){return function(){return a.a?a.a(b):a.call(null,b)}}(c,e,a,this)),Gi(!0);64<d.Hb?(d.Hb=0,pi(d.Za,Ii)):d.Hb+=1;if(v(c.Pb(null))){if(!(1024>d.Za.length))throw Error([A("Assert failed: "),A([A("No more than "),A(1024),A(" pending puts are allowed on a single channel."),A(" Consider using a windowed buffer.")].join("")),A("\n"),A(te.l(nc([ec(Pg,ec(Kg,Og),Wh)],0)))].join(""));oi(d.Za,
new Hi(c,b))}return null};
Ki.prototype.Qb=function(a,b){var c=this;if(null!=c.G&&0<U(c.G)){for(var d=b.la,e=Gi(c.G.G.pop());;){if(!v(si(c.G))){var f=c.Za.pop();if(null!=f){var h=f.vb,k=f.F;Ei(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(h.la,h,k,f,d,e,this));Fc(c.ra.b?c.ra.b(c.G,k):c.ra.call(null,c.G,k))&&Ji(this);continue}}break}return e}d=function(){for(;;){var a=c.Za.pop();if(v(a)){if(hi(a.vb))return a}else return null}}();if(v(d))return e=ii(d.vb),Ei(function(a){return function(){return a.a?a.a(!0):
a.call(null,!0)}}(e,d,this)),Gi(d.F);if(v(c.closed))return v(c.G)&&(c.ra.a?c.ra.a(c.G):c.ra.call(null,c.G)),v(v(!0)?b.la:!0)?(d=function(){var a=c.G;return v(a)?0<U(c.G):a}(),d=v(d)?c.G.G.pop():null,Gi(d)):null;64<c.Ib?(c.Ib=0,pi(c.gb,hi)):c.Ib+=1;if(v(b.Pb(null))){if(!(1024>c.gb.length))throw Error([A("Assert failed: "),A([A("No more than "),A(1024),A(" pending takes are allowed on a single channel.")].join("")),A("\n"),A(te.l(nc([ec(Pg,ec(Kg,Vh),Wh)],0)))].join(""));oi(c.gb,b)}return null};
Ki.prototype.Eb=function(){var a=this;if(!a.closed)for(a.closed=!0,v(function(){var b=a.G;return v(b)?0===a.Za.length:b}())&&(a.ra.a?a.ra.a(a.G):a.ra.call(null,a.G));;){var b=a.gb.pop();if(null==b)break;else{var c=b.la,d=v(function(){var b=a.G;return v(b)?0<U(a.G):b}())?a.G.G.pop():null;Ei(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(c,d,b,this))}}return null};function Li(a){console.log(a);return null}
function Mi(a,b){var c=(v(null)?null:Li).call(null,b);return null==c?a:li.b(a,c)}
function Ni(a){return new Ki(qi(32),0,qi(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.b?a.b(c,d):a.call(null,c,d)}catch(e){return Mi(c,e)}}function d(c){try{return a.a?a.a(c):a.call(null,c)}catch(d){return Mi(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.b=c;return e}()}(v(null)?null.a?null.a(li):null.call(null,li):li)}())};var Oi,Pi=function Pi(b){"undefined"===typeof Oi&&(Oi=function(b,d,e){this.Cc=b;this.la=d;this.Fc=e;this.h=393216;this.w=0},Oi.prototype.O=function(b,d){return new Oi(this.Cc,this.la,d)},Oi.prototype.N=function(){return this.Fc},Oi.prototype.dc=function(){return!0},Oi.prototype.Pb=function(){return!0},Oi.prototype.ec=function(){return this.la},Oi.Rb=function(){return new X(null,3,5,Y,[Ac(Sh,new t(null,2,[Tg,!0,fe,ec(ge,ec(new X(null,1,5,Y,[ci],null)))],null)),ci,Qh],null)},Oi.ub=!0,Oi.cb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18915",
Oi.Gb=function(b,d){return Db(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18915")});return new Oi(Pi,b,ie)};function Qi(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Eb(),b;}}function Ri(a,b,c){c=c.Qb(0,Pi(function(c){a[2]=c;a[1]=b;return Qi(a)}));return v(c)?(a[2]=Cc.a?Cc.a(c):Cc.call(null,c),a[1]=b,dh):null}
function Si(a,b,c){b=b.Fb(0,c,Pi(function(b){a[2]=b;a[1]=16;return Qi(a)}));return v(b)?(a[2]=Cc.a?Cc.a(b):Cc.call(null,b),a[1]=16,dh):null}function Ti(a,b){var c=a[6];null!=b&&c.Fb(0,b,Pi(function(){return function(){return null}}(c)));c.Eb();return c}function Ui(a,b,c,d,e,f,h,k){this.xa=a;this.ya=b;this.Aa=c;this.za=d;this.Ca=e;this.Fa=f;this.oa=h;this.s=k;this.h=2229667594;this.w=8192}g=Ui.prototype;g.K=function(a,b){return ab.c(this,b,null)};
g.H=function(a,b,c){switch(b instanceof w?b.ta:null){case "catch-block":return this.xa;case "catch-exception":return this.ya;case "finally-block":return this.Aa;case "continue-block":return this.za;case "prev":return this.Ca;default:return J.c(this.oa,b,c)}};
g.L=function(a,b,c){return ff(b,function(){return function(a){return ff(b,Z,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,$d.b(new X(null,5,5,Y,[new X(null,2,5,Y,[fh,this.xa],null),new X(null,2,5,Y,[Ch,this.ya],null),new X(null,2,5,Y,[Xg,this.Aa],null),new X(null,2,5,Y,[Ih,this.za],null),new X(null,2,5,Y,[Eh,this.Ca],null)],null),this.oa))};g.sa=function(){return new tf(0,this,5,new X(null,5,5,Y,[fh,Ch,Xg,Ih,Eh],null),Wb(this.oa))};g.N=function(){return this.Fa};
g.X=function(){return 5+U(this.oa)};g.P=function(){var a=this.s;if(null!=a)return a;a:for(var a=0,b=L(this);;)if(b)var c=M(b),a=(a+(jc(Gd.a?Gd.a(c):Gd.call(null,c))^jc(Hd.a?Hd.a(c):Hd.call(null,c))))%4503599627370496,b=P(b);else break a;return this.s=a};g.v=function(a,b){var c;c=v(b)?(c=this.constructor===b.constructor)?sf(this,b):c:b;return v(c)?!0:!1};
g.Bb=function(a,b){var c;if(od(new eg(null,new t(null,5,[Xg,null,fh,null,Ch,null,Eh,null,Ih,null],null),null),b))c=Zc.b(Ac(Ke(ie,this),this.Fa),b);else{c=this.xa;var d=this.ya,e=this.Aa,f=this.za,h=this.Ca,k=this.Fa,l;l=Zc.b(this.oa,b);l=L(l)?l:null;c=new Ui(c,d,e,f,h,k,l,null)}return c};
g.Va=function(a,b,c){return v(Od.b?Od.b(fh,b):Od.call(null,fh,b))?new Ui(c,this.ya,this.Aa,this.za,this.Ca,this.Fa,this.oa,null):v(Od.b?Od.b(Ch,b):Od.call(null,Ch,b))?new Ui(this.xa,c,this.Aa,this.za,this.Ca,this.Fa,this.oa,null):v(Od.b?Od.b(Xg,b):Od.call(null,Xg,b))?new Ui(this.xa,this.ya,c,this.za,this.Ca,this.Fa,this.oa,null):v(Od.b?Od.b(Ih,b):Od.call(null,Ih,b))?new Ui(this.xa,this.ya,this.Aa,c,this.Ca,this.Fa,this.oa,null):v(Od.b?Od.b(Eh,b):Od.call(null,Eh,b))?new Ui(this.xa,this.ya,this.Aa,
this.za,c,this.Fa,this.oa,null):new Ui(this.xa,this.ya,this.Aa,this.za,this.Ca,this.Fa,Xc.c(this.oa,b,c),null)};g.V=function(){return L($d.b(new X(null,5,5,Y,[new X(null,2,5,Y,[fh,this.xa],null),new X(null,2,5,Y,[Ch,this.ya],null),new X(null,2,5,Y,[Xg,this.Aa],null),new X(null,2,5,Y,[Ih,this.za],null),new X(null,2,5,Y,[Eh,this.Ca],null)],null),this.oa))};g.O=function(a,b){return new Ui(this.xa,this.ya,this.Aa,this.za,this.Ca,b,this.oa,this.s)};
g.W=function(a,b){return fd(b)?db(this,D.b(b,0),D.b(b,1)):Ma.c(Ta,this,b)};
function Vi(a){for(;;){var b=a[4],c=fh.a(b),d=Ch.a(b),e=a[5];if(v(function(){var a=e;return v(a)?Ha(b):a}()))throw e;if(v(function(){var a=e;return v(a)?(a=c,v(a)?I.b(Wg,d)||e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Xc.l(b,fh,null,nc([Ch,null],0));break}if(v(function(){var a=e;return v(a)?Ha(c)&&Ha(Xg.a(b)):a}()))a[4]=Eh.a(b);else{if(v(function(){var a=e;return v(a)?(a=Ha(c))?Xg.a(b):a:a}())){a[1]=Xg.a(b);a[4]=Xc.c(b,Xg,null);break}if(v(function(){var a=Ha(e);return a?Xg.a(b):a}())){a[1]=
Xg.a(b);a[4]=Xc.c(b,Xg,null);break}if(Ha(e)&&Ha(Xg.a(b))){a[1]=Ih.a(b);a[4]=Eh.a(b);break}throw Error("No matching clause");}}};for(var Wi=Array(1),Xi=0;;)if(Xi<Wi.length)Wi[Xi]=null,Xi+=1;else break;function Yi(a){"undefined"===typeof di&&(di=function(a,c,d){this.la=a;this.Ub=c;this.Ec=d;this.h=393216;this.w=0},di.prototype.O=function(a,c){return new di(this.la,this.Ub,c)},di.prototype.N=function(){return this.Ec},di.prototype.dc=function(){return!0},di.prototype.Pb=function(){return this.Ub},di.prototype.ec=function(){return this.la},di.Rb=function(){return new X(null,3,5,Y,[ci,Qg,Kh],null)},di.ub=!0,di.cb="cljs.core.async/t_cljs$core$async16110",di.Gb=function(a,c){return Db(c,"cljs.core.async/t_cljs$core$async16110")});
return new di(a,!0,ie)}function Zi(a){a=I.b(a,0)?null:a;if(v(null)&&!v(a))throw Error([A("Assert failed: "),A("buffer must be supplied when transducer is"),A("\n"),A(te.l(nc([Hh],0)))].join(""));a="number"===typeof a?new ri(qi(a),a):a;return Ni(a)}function $i(a,b){var c=ei(a,Yi(b));if(v(c)){var d=Cc.a?Cc.a(c):Cc.call(null,c);v(!0)?b.a?b.a(d):b.call(null,d):Ei(function(a){return function(){return b.a?b.a(a):b.call(null,a)}}(d,c))}return null}var aj;aj=Yi(function(){return null});
function bj(a,b){var c=fi(a,b,aj);return v(c)?Cc.a?Cc.a(c):Cc.call(null,c):!0}
function cj(a){var b=xd(new X(null,1,5,Y,[dj],null)),c=Zi(null),d=U(b),e=Xd(d),f=Zi(1),h=re.a?re.a(null):re.call(null,null),k=Me(function(a,b,c,d,e,f){return function(h){return function(a,b,c,d,e,f){return function(a){d[h]=a;return 0===xe.b(f,Ad)?bj(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,h),kg(0,d)),l=Zi(1);Ei(function(b,c,d,e,f,h,k,l){return function(){var H=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Od(e,dh)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,Vi(c),d=dh;else throw f;}if(!Od(d,dh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.o=c;d.a=b;return d}()}(function(b,c,d,e,f,h,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,dh;if(1===f)return b[2]=null,b[1]=2,dh;if(4===f){var m=
b[7],f=m<e;b[1]=v(f)?6:7;return dh}if(15===f)return f=b[2],b[2]=f,b[1]=3,dh;if(13===f)return f=gi(d),b[2]=f,b[1]=15,dh;if(6===f)return b[2]=null,b[1]=11,dh;if(3===f)return f=b[2],Ti(b,f);if(12===f){f=b[8];f=b[2];a:for(var m=f,n=Fa;;)if(L(m)){var q;q=M(m);q=n.a?n.a(q):n.call(null,q);if(v(q)){m=q;break a}m=P(m)}else{m=null;break a}b[8]=f;b[1]=v(m)?13:14;return dh}return 2===f?(f=ue.b?ue.b(k,e):ue.call(null,k,e),b[7]=0,b[9]=f,b[2]=null,b[1]=4,dh):11===f?(m=b[7],b[4]=new Ui(10,Object,null,9,b[4],null,
null,null),f=c.a?c.a(m):c.call(null,m),m=l.a?l.a(m):l.call(null,m),f=$i(f,m),b[2]=f,Vi(b),dh):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,dh):5===f?(b[11]=b[2],Ri(b,12,h)):14===f?(f=b[8],f=C.b(a,f),Si(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,dh):10===f?(m=b[2],f=xe.b(k,Ad),b[13]=m,b[2]=f,Vi(b),dh):8===f?(f=b[2],b[2]=f,b[1]=5,dh):null}}(b,c,d,e,f,h,k,l),b,c,d,e,f,h,k,l)}(),S=function(){var a=H.o?H.o():H.call(null);a[6]=b;return a}();return Qi(S)}}(l,b,c,d,e,f,h,k));return c};var ej=VDOM.diff,fj=VDOM.patch,gj=VDOM.create;function hj(a){return Ie(Fa,Ie(md,Je(a)))}function ij(a,b,c){return new VDOM.VHtml(Fd(a),Eg(b),Eg(c))}function jj(a,b,c){return new VDOM.VSvg(Fd(a),Eg(b),Eg(c))}kj;
var lj=function lj(b){if(null==b)return new VDOM.VText("");if(md(b))return ij(rh,ie,W.b(lj,hj(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(I.b(Gh,M(b)))return kj.a?kj.a(b):kj.call(null,b);var c=V(b,0),d=V(b,1);b=Ed(b,2);return ij(c,d,W.b(lj,hj(b)))},kj=function kj(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(I.b(ai,M(b))){var c=V(b,0),d=V(b,1);b=Ed(b,2);return jj(c,d,W.b(lj,hj(b)))}c=V(b,0);d=V(b,1);
b=Ed(b,2);return jj(c,d,W.b(kj,hj(b)))};
function mj(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return re.a?re.a(a):re.call(null,a)}(),c=function(){var a;a=Cc.a?Cc.a(b):Cc.call(null,b);a=gj.a?gj.a(a):gj.call(null,a);return re.a?re.a(a):re.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.o?a.o():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(Cc.a?Cc.a(c):Cc.call(null,c));return function(a,b,c){return function(d){var l=
lj(d);d=function(){var b=Cc.a?Cc.a(a):Cc.call(null,a);return ej.b?ej.b(b,l):ej.call(null,b,l)}();ue.b?ue.b(a,l):ue.call(null,a,l);d=function(a,b,c,d){return function(){return xe.c(d,fj,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};function nj(a,b){var c=V(a,0),d=V(a,1),e=V(b,0),f=V(b,1),h=(f-e)/(d-c);return function(a,b){return function(c){return a*c+b}}(h,e-h*c,a,c,d,b,e,f)}var oj=lg(ph,Zh);function pj(a){return Le(ie,W.a(lg(Bh,yd)),a)};function qj(a){this.la=a}qj.prototype.Dc=function(a){return this.la.a?this.la.a(a):this.la.call(null,a)};function rj(a){return new qj(a)}ba("Hook",qj);ba("Hook.prototype.hook",qj.prototype.Dc);function sj(a){var b=De(new X(null,2,5,Y,[0,1],null)),c=De(new X(null,2,5,Y,[0,1],null));return $d.b(function(){return function e(a){return new Qd(null,function(){for(var b=a;;){var c=L(b);if(c){var l=c,m=M(l),n=V(m,0),r=V(m,1);if(c=L(function(a,b,c,e,f,h){return function T(k){return new Qd(null,function(){return function(){for(;;){var a=L(k);if(a){if(id(a)){var b=Qb(a),c=U(b),e=Ud(c);a:for(var f=0;;)if(f<c){var h=D.b(b,f),l=V(h,0),h=V(h,1);e.add(new t(null,2,[eh,ah,gh,new X(null,2,5,Y,[l,h],null)],
null));f+=1}else{b=!0;break a}return b?Vd(e.S(),T(Sb(a))):Vd(e.S(),null)}b=M(a);e=V(b,0);b=V(b,1);return Q(new t(null,2,[eh,ah,gh,new X(null,2,5,Y,[e,b],null)],null),T(N(a)))}return null}}}(a,b,c,e,f,h),null,null)}}(b,m,n,r,l,c)(Ne(2,2,Ce(n,wd(Zh,r))))))return $d.b(c,e(N(b)));b=N(b)}else return null}},null,null)}(W.c(jf,b,Bf(vd(Gd,Gg(ph,a)))))}(),function(){return function e(a){return new Qd(null,function(){for(var b=a;;){var c=L(b);if(c){var l=c,m=M(l),n=V(m,0),r=V(m,1);if(c=L(function(a,b,c,e,f,
h){return function T(k){return new Qd(null,function(){return function(){for(;;){var a=L(k);if(a){if(id(a)){var b=Qb(a),c=U(b),e=Ud(c);a:for(var f=0;;)if(f<c){var h=D.b(b,f),l=V(h,0),h=V(h,1);e.add(new t(null,2,[eh,ah,gh,new X(null,2,5,Y,[l,h],null)],null));f+=1}else{b=!0;break a}return b?Vd(e.S(),T(Sb(a))):Vd(e.S(),null)}b=M(a);e=V(b,0);b=V(b,1);return Q(new t(null,2,[eh,ah,gh,new X(null,2,5,Y,[e,b],null)],null),T(N(a)))}return null}}}(a,b,c,e,f,h),null,null)}}(b,m,n,r,l,c)(Ne(2,2,Ce(n,wd(ph,r))))))return $d.b(c,
e(N(b)));b=N(b)}else return null}},null,null)}(W.c(jf,c,Bf(vd(Gd,Gg(Zh,a)))))}())}
function tj(){return new t(null,4,[Fh,Yg,Zg,128,qh,128,Qe,pj(function(){return function b(c){return new Qd(null,function(){for(var d=c;;){var e=L(d);if(e){var f=e,h=M(f);if(e=L(function(b,c,d,e){return function q(f){return new Qd(null,function(b,c){return function(){for(;;){var b=L(f);if(b){if(id(b)){var d=Qb(b),e=U(d),h=Ud(e);a:for(var k=0;;)if(k<e){var l=D.b(d,k),l=new t(null,3,[Bh,zg(),ph,c,Zh,l],null);h.add(l);k+=1}else{d=!0;break a}return d?Vd(h.S(),q(Sb(b))):Vd(h.S(),null)}h=M(b);return Q(new t(null,
3,[Bh,zg(),ph,c,Zh,h],null),q(N(b)))}return null}}}(b,c,d,e),null,null)}}(d,h,f,e)(kg(0,128))))return $d.b(e,b(N(d)));d=N(d)}else return null}},null,null)}(kg(0,128))}())],null)}
function uj(a){var b=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,c=J.b(b,Zg),d=J.b(b,qh);return function(a,b,c,d){return function m(n){return new Qd(null,function(a,b,c,d){return function(){for(var e=n;;){var f=L(e);if(f){var h=f,k=M(h);if(f=L(function(a,b,c,d,e,f,h,k){return function Ja(m){return new Qd(null,function(a,b){return function(){for(;;){var a=L(m);if(a){if(id(a)){var c=Qb(a),d=U(c),e=Ud(d);a:for(var f=0;;)if(f<d){var h=D.b(c,f);e.add(new t(null,2,[ph,b,Zh,h],null));f+=1}else{c=!0;break a}return c?
Vd(e.S(),Ja(Sb(a))):Vd(e.S(),null)}e=M(a);return Q(new t(null,2,[ph,b,Zh,e],null),Ja(N(a)))}return null}}}(a,b,c,d,e,f,h,k),null,null)}}(e,k,h,f,a,b,c,d)(kg(0,d+1))))return $d.b(f,m(N(e)));e=N(e)}else return null}}}(a,b,c,d),null,null)}}(a,b,c,d)(kg(0,c+1))}
function vj(a){var b=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,c=J.b(b,Qe),d=Bf(c),e=Le(ie,W.a(lg(oj,yd)),d);return Le(ie,W.a(lg(Bh,function(a,b,c){return function(a){var d=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a;a=J.b(d,ph);d=J.b(d,Zh);return hg(Ie(Fa,W.b(oe.b(Bh,b),c(a,d))))}}(d,e,function(){return function(a,b){return new X(null,4,5,Y,[new X(null,2,5,Y,[a-1,b],null),new X(null,2,5,Y,[a+1,b],null),new X(null,2,5,Y,[a,b-1],null),new X(null,2,5,Y,[a,b+1],null)],null)}}(d,e,a,b,c),a,b,c))),d)}
function wj(a){var b=V(a,0),c=V(b,0),d=V(b,1),e=V(a,1),f=V(e,0),h=V(e,1);if(I.b(c,f)){var k=td(new X(null,2,5,Y,[d,h],null)),l=V(k,0),m=V(k,1);a=function(a,b,c,d,e,f,h,k,l,m){return function xa(E){return new Qd(null,function(a,b,c,d,e,f){return function(){for(;;){var a=L(E);if(a){if(id(a)){var b=Qb(a),c=U(b),d=Ud(c);a:for(var e=0;;)if(e<c){var h=D.b(b,e);d.add(new X(null,2,5,Y,[new X(null,2,5,Y,[f,h],null),new X(null,2,5,Y,[f,h+1],null)],null));e+=1}else{b=!0;break a}return b?Vd(d.S(),xa(Sb(a))):
Vd(d.S(),null)}d=M(a);return Q(new X(null,2,5,Y,[new X(null,2,5,Y,[f,d],null),new X(null,2,5,Y,[f,d+1],null)],null),xa(N(a)))}return null}}}(a,b,c,d,e,f,h,k,l,m),null,null)}}(k,l,m,a,b,c,d,e,f,h);return a(kg(l,m))}return I.b(d,h)?(k=td(new X(null,2,5,Y,[c,f],null)),l=V(k,0),m=V(k,1),a=function(a,b,c,d,e,f,h,k,l,m){return function xa(E){return new Qd(null,function(a,b,c,d,e,f,h){return function(){for(;;){var a=L(E);if(a){if(id(a)){var b=Qb(a),c=U(b),d=Ud(c);a:for(var e=0;;)if(e<c){var f=D.b(b,e);d.add(new X(null,
2,5,Y,[new X(null,2,5,Y,[f,h],null),new X(null,2,5,Y,[f+1,h],null)],null));e+=1}else{b=!0;break a}return b?Vd(d.S(),xa(Sb(a))):Vd(d.S(),null)}d=M(a);return Q(new X(null,2,5,Y,[new X(null,2,5,Y,[d,h],null),new X(null,2,5,Y,[d+1,h],null)],null),xa(N(a)))}return null}}}(a,b,c,d,e,f,h,k,l,m),null,null)}}(k,l,m,a,b,c,d,e,f,h),a(kg(l,m))):new X(null,1,5,Y,[new X(null,2,5,Y,[new X(null,2,5,Y,[c,d],null),new X(null,2,5,Y,[f,h],null)],null)],null)}
function xj(a,b){var c=V(a,0),d=V(a,1),e=V(b,0),f=V(b,1);return I.b(c,e)?d<f?gg([new X(null,2,5,Y,[c-1,d],null),new X(null,2,5,Y,[e,f-1],null)]):gg([new X(null,2,5,Y,[e-1,f],null),new X(null,2,5,Y,[c,d-1],null)]):I.b(d,f)?c<e?gg([new X(null,2,5,Y,[e-1,f],null),new X(null,2,5,Y,[c,d-1],null)]):gg([new X(null,2,5,Y,[c-1,d],null),new X(null,2,5,Y,[e,f-1],null)]):new X(null,2,5,Y,[a,b],null)}function yj(a,b){var c=V(b,0),d=V(b,1);return Re(Re(a,c,d),d,c)}
function zj(a,b){var c=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,d=J.b(c,Qe),e=vj(c),f=Ke(ie,function(){return function(a,b,c,d,e){return function q(f){return new Qd(null,function(a,b,c,d,e){return function(){for(var h=f;;){var k=L(h);if(k){var l=k,m=M(l),n=V(m,0),ea=V(m,1);if(k=L(function(a,b,c,d,e,f,h,k,l,m,n){return function Hb(q){return new Qd(null,function(a,b,c,d,e,f,h,k,l,m,n){return function(){for(;;){var a=L(q);if(a){if(id(a)){var b=Qb(a),d=U(b),e=Ud(d);return function(){for(var a=0;;)if(a<d){var f=
D.b(b,a);Wd(e,new X(null,2,5,Y,[gg([function(){var a=n.a?n.a(f):n.call(null,f);return oj.a?oj.a(a):oj.call(null,a)}(),function(){var a=n.a?n.a(c):n.call(null,c);return oj.a?oj.a(a):oj.call(null,a)}()]),new X(null,2,5,Y,[c,f],null)],null));a+=1}else return!0}()?Vd(e.S(),Hb(Sb(a))):Vd(e.S(),null)}var f=M(a);return Q(new X(null,2,5,Y,[gg([function(){var a=n.a?n.a(f):n.call(null,f);return oj.a?oj.a(a):oj.call(null,a)}(),function(){var a=n.a?n.a(c):n.call(null,c);return oj.a?oj.a(a):oj.call(null,a)}()]),
new X(null,2,5,Y,[c,f],null)],null),Hb(N(a)))}return null}}}(a,b,c,d,e,f,h,k,l,m,n),null,null)}}(h,m,n,ea,l,k,a,b,c,d,e)(ea)))return $d.b(k,q(N(h)));h=N(h)}else return null}}}(a,b,c,d,e),null,null)}}(e,a,c,c,d)(e)}()),f=oe.l(W.a(gh),W.a(function(){return function(a){return W.b(oj,a)}}(e,f,a,c,c,d)),oe.b(W.a(wj),Ee),nc([W.a(function(){return function(a){return C.b(xj,a)}}(e,f,a,c,c,d)),Ge(),W.a(hg),W.a(f)],0));return Xc.l(c,Oh,zd(f,yj,e,b),nc([ih,b],0))}
function Aj(a,b){for(var c=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,d=J.b(c,Qe),e=J.b(c,Oh),c=Bh.a(M(He(function(){return function(a){return I.b(oj.a?oj.a(b):oj.call(null,b),oj.a?oj.a(a):oj.call(null,a))}}(a,c,d,e),Bf(d)))),c=gg([c]);;)if(d=L(Ie(c,Fe(e,nc([c],0)))))c=C.c(Rc,c,d);else return c};function Bj(a,b,c){b=Aj(a,b);c=I.b(jh,c)?null:c;return Pe(a,function(a,b,c){return function(b){return Ma.c(c,b,a)}}(b,c,function(a,b){return function(a,c){return Oe(a,new X(null,2,5,Y,[c,Xh],null),b)}}(b,c)))};var Cj=new t(null,7,[th,"dodgerblue",Rg,"gold",Mh,"chocolate",Dh,"yellowgreen",$h,"forestgreen",Rh,"rgb(80, 50, 50)",Ph,"deepskyblue"],null);
function Dj(a,b){var c=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,d=J.b(c,Qe),e=J.b(c,ih),f=J.b(c,Zg),h=J.b(c,qh),k=null!=b&&(b.h&64||b.ba)?C.b(yc,b):b,l=J.b(k,Vg),m=null!=l&&(l.h&64||l.ba)?C.b(yc,l):l,n=J.b(m,Lh),r=J.b(m,Hg),q=J.b(k,mh),u=J.b(k,bi),z=J.b(k,Uh),B=J.b(k,Jh);return function(a,b,c,d,e,f,h,k,l,m,n,q,r,u,z,B,Sa){return function(a){a=a.getContext("2d");var b=(u-Sa-Sa)/f,c=(u-Sa-Sa)/h;a.clearRect(0,0,u,u);a.strokeStyle="black";for(var k=L(e),l=null,m=0,n=0;;)if(n<m){var z=l.T(null,n),z=null!=z&&
(z.h&64||z.ba)?C.b(yc,z):z,z=J.b(z,gh),B=V(z,0),G=V(z,1),z=a;z.beginPath();z.moveTo(function(){var a=B.a?B.a(ph):B.call(null,ph);return q.a?q.a(a):q.call(null,a)}(),function(){var a=B.a?B.a(Zh):B.call(null,Zh);return r.a?r.a(a):r.call(null,a)}());z.lineTo(function(){var a=G.a?G.a(ph):G.call(null,ph);return q.a?q.a(a):q.call(null,a)}(),function(){var a=G.a?G.a(Zh):G.call(null,Zh);return r.a?r.a(a):r.call(null,a)}());z.stroke();n+=1}else if(k=L(k)){if(id(k))m=Qb(k),k=Sb(k),l=m,m=U(m);else{var l=M(k),
l=null!=l&&(l.h&64||l.ba)?C.b(yc,l):l,l=J.b(l,gh),H=V(l,0),S=V(l,1),l=a;l.beginPath();l.moveTo(function(){var a=H.a?H.a(ph):H.call(null,ph);return q.a?q.a(a):q.call(null,a)}(),function(){var a=H.a?H.a(Zh):H.call(null,Zh);return r.a?r.a(a):r.call(null,a)}());l.lineTo(function(){var a=S.a?S.a(ph):S.call(null,ph);return q.a?q.a(a):q.call(null,a)}(),function(){var a=S.a?S.a(Zh):S.call(null,Zh);return r.a?r.a(a):r.call(null,a)}());l.stroke();k=P(k);l=null;m=0}n=0}else break;for(var k=L(He(Xh,Bf(d))),l=
null,ea=z=0;;)if(ea<z){var m=l.T(null,ea),pa=null!=m&&(m.h&64||m.ba)?C.b(yc,m):m;J.b(pa,Bh);var m=J.b(pa,ph),n=J.b(pa,Zh),qa=J.b(pa,Xh);a.fillStyle=function(){var a=Cj.a?Cj.a(qa):Cj.call(null,qa);wg(nc([ec(yh,Sg)," \x3d\x3e ",a],0));return a}();a.fillRect(q.a?q.a(m):q.call(null,m),r.a?r.a(n):r.call(null,n),b,c);ea+=1}else if(k=L(k))id(k)?(m=Qb(k),k=Sb(k),l=m,z=m=U(m)):(l=M(k),l=null!=l&&(l.h&64||l.ba)?C.b(yc,l):l,J.b(l,Bh),m=J.b(l,ph),n=J.b(l,Zh),qa=J.b(l,Xh),a.fillStyle=function(){var a=Cj.a?Cj.a(qa):
Cj.call(null,qa);wg(nc([ec(yh,Sg)," \x3d\x3e ",a],0));return a}(),a.fillRect(q.a?q.a(m):q.call(null,m),r.a?r.a(n):r.call(null,n),b,c),k=P(k),l=null,z=0),ea=0;else return null}}(a,c,c,d,e,f,h,b,k,l,m,n,r,q,u,z,B)}
function Ej(a){var b=Fj,c=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a,d=J.b(c,Fh),e=J.b(c,mh),f=J.b(c,uh),h=J.b(c,Uh);return new X(null,4,5,Y,[rh,ie,new X(null,4,5,Y,[rh,new t(null,1,[kh,"controls"],null),function(){return function(a,c,d,e,f,h,u){return function B(G){return new Qd(null,function(a,c,d,e,f,h,k){return function(){for(;;){var l=L(G);if(l){var m=l;if(id(m)){var n=Qb(m),q=U(n),r=Ud(q);return function(){for(var u=0;;)if(u<q){var B=D.b(n,u);Wd(r,new X(null,2,5,Y,[rh,new t(null,2,[kh,[A("shader shader--"),
A(Fd(B)),A(I.b(k,B)?" shader--is-selected":null)].join(""),ch,function(a,c){return function(){var a=new X(null,2,5,Y,[Ug,c],null);return b.a?b.a(a):b.call(null,a)}}(u,B,n,q,r,m,l,a,c,d,e,f,h,k)],null)],null));u+=1}else return!0}()?Vd(r.S(),B(Sb(m))):Vd(r.S(),null)}var u=M(m);return Q(new X(null,2,5,Y,[rh,new t(null,2,[kh,[A("shader shader--"),A(Fd(u)),A(I.b(k,u)?" shader--is-selected":null)].join(""),ch,function(a){return function(){var c=new X(null,2,5,Y,[Ug,a],null);return b.a?b.a(c):b.call(null,
c)}}(u,m,l,a,c,d,e,f,h,k)],null)],null),B(N(m)))}return null}}}(a,c,d,e,f,h,u),null,null)}}(a,c,c,d,e,f,h)(f)}(),new X(null,5,5,Y,[Ah,new t(null,1,[kh,"size"],null),"Size: ",new X(null,2,5,Y,[Nh,new t(null,5,[eh,"range",Mg,200,zh,1E3,$g,e,Lg,function(){return function(){var a=new X(null,2,5,Y,[mh,this.value],null);return b.a?b.a(a):b.call(null,a)}}(a,c,c,d,e,f,h)],null)],null),e],null)],null),new X(null,2,5,Y,[lh,new t(null,5,[Bh,"canvas",bh,e,Yh,e,ch,function(){return function(a){a=new X(null,2,
5,Y,[nh,new X(null,2,5,Y,[a.pageX-this.offsetLeft,a.pageY-this.offsetTop],null)],null);return b.a?b.a(a):b.call(null,a)}}(a,c,c,d,e,f,h),Th,rj(Dj(d,c))],null)],null)],null)};var Gj=Error();function Hj(){var a=Ij,b=Jj,c=Kj,d=Zi(null);bj(d,b);var e=Zi(1);Ei(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Od(e,dh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Vi(c),d=dh;else throw f;}if(!Od(d,dh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.o=c;d.a=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Ri(d,2,c);if(2===f){var f=b,h=d[2];d[7]=f;d[8]=h;d[2]=null;d[1]=3;return dh}return 3===f?(f=d[9],f=d[7],h=d[8],f=a.b?a.b(f,h):a.call(null,f,h),h=bj(e,f),d[10]=h,d[9]=f,Ri(d,5,c)):4===f?(f=d[2],Ti(d,f)):5===f?(f=d[9],h=d[2],d[7]=f,d[8]=h,d[2]=null,d[1]=3,dh):null}}(d,e),d,e)}(),l=function(){var a=k.o?k.o():k.call(null);a[6]=d;return a}();return Qi(l)}}(e,d));return d}
function Lj(){var a=Mj,b=mj(),c=Zi(1);Ei(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Od(e,dh)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Vi(c),d=dh;else throw f;}if(!Od(d,dh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.o=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,dh):2===d?Ri(c,4,a):3===d?(d=c[2],Ti(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=v(d)?5:6,dh):5===d?(d=c[7],d=b.a?b.a(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,dh):6===d?(c[2]=null,c[1]=7,dh):7===d?(d=c[2],c[2]=d,c[1]=3,dh):null}}(c),c)}(),f=function(){var a=e.o?e.o():e.call(null);a[6]=c;return a}();return Qi(f)}}(c));return c};sa=!1;oa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Da.a?Da.a(a):Da.call(null,a))}a.u=0;a.B=function(a){a=L(a);return b(a)};a.l=b;return a}();
ra=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Da.a?Da.a(a):Da.call(null,a))}a.u=0;a.B=function(a){a=L(a);return b(a)};a.l=b;return a}();
function Ij(a,b){try{if(Od(b,oh))return a;throw Gj;}catch(c){if(c instanceof Error)if(c===Gj)try{if(fd(b)&&2===U(b))try{var d=Vc(b,0);if(Od(d,Ug)){var e=Vc(b,1);return Xc.c(a,Uh,e)}throw Gj;}catch(f){if(f instanceof Error)if(e=f,e===Gj)try{d=Vc(b,0);if(Od(d,mh)){var h=Vc(b,1);return Xc.c(a,mh,h|0)}throw Gj;}catch(k){if(k instanceof Error)if(k===Gj)try{if(d=Vc(b,0),Od(d,nh))try{var l=Vc(b,1);if(fd(l)&&2===U(l)){var m=Vc(l,0),n=Vc(l,1),r,q=new X(null,2,5,Y,[m,n],null),u=a.a?a.a(Vg):a.call(null,Vg),
z=V(q,0),B=V(q,1),G=null!=u&&(u.h&64||u.ba)?C.b(yc,u):u,H=J.b(G,ph),S=J.b(G,Zh);r=new t(null,2,[ph,Math.floor(H.a?H.a(z):H.call(null,z)),Zh,Math.floor(S.a?S.a(B):S.call(null,B))],null);return Se(a,Fh,Bj,r,a.a?a.a(Uh):a.call(null,Uh))}throw Gj;}catch(T){if(T instanceof Error){var wa=T;if(wa===Gj)throw Gj;throw wa;}throw T;}else throw Gj;}catch(xa){if(xa instanceof Error){wa=xa;if(wa===Gj)throw Gj;throw wa;}throw xa;}else throw k;else throw k;}else throw e;else throw f;}else throw Gj;}catch(E){if(E instanceof
Error){e=E;if(e===Gj)throw Error([A("No matching clause: "),A(b)].join(""));throw e;}throw E;}else throw c;else throw c;}}
if("undefined"===typeof Jj)var Jj=function(){var a=tj(),b=function(a,b,e){return function(a){var c=null!=a&&(a.h&64||a.ba)?C.b(yc,a):a;a=J.b(c,ph);c=J.b(c,Zh);return 0<a&&a<b&&0<c&&c<e&&.5<Bg.o()}}(1E3,128,128,1.5,a);return new t(null,7,[mh,1E3,bi,fg,uh,new X(null,8,5,Y,[jh,th,Rg,Mh,Dh,$h,Rh,Ph],null),Uh,th,Jh,1.5,Vg,new t(null,4,[Lh,nj(new X(null,2,5,Y,[0,128],null),new X(null,2,5,Y,[1.5,998.5],null)),Hg,nj(new X(null,2,5,Y,[0,128],null),new X(null,2,5,Y,[1.5,998.5],null)),ph,nj(new X(null,2,5,Y,
[1.5,998.5],null),new X(null,2,5,Y,[0,128],null)),Zh,nj(new X(null,2,5,Y,[1.5,998.5],null),new X(null,2,5,Y,[0,128],null))],null),Fh,zj(a,sj(Ie(b,uj(a))))],null)}();if("undefined"===typeof Kj)var Kj=Zi(null);function Fj(a){return bj(Kj,a)}if("undefined"===typeof dj)var dj=Hj();if("undefined"===typeof Nj){var Mj;Mj=cj(function(a){return Ej(a)});var Nj;Nj=Lj()};