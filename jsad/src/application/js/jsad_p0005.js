// Create namespace or reuse existing
var jsad = jsad || {};

// encapsulate into an IFFE (https://en.wikipedia.org/wiki/Immediately_invoked_function_expression)
(function (item, message, debug) {
  function _validateNumber(pElement) {
    var myItem = item(pElement);

    // use apex.debug instaed of console.log
    // apex.debug inherits current debugging settings from the apex session
    debug.info("My Item", myItem);

    // getValue always returns a string
    var myData = myItem.getValue();

    // In case of a number page item this return a number
    // The function is only available for number page items
    // which could lead to errors if called for other page items
    // var myNativeData = myItem.getNativeValue();

    // safer code, however looks a bit awkward at first
    // This will return undefined if the method getNativeValue
    // does not exist instead of raising an error
    var myNativeData = myItem.getNativeValue?.();

    // Template Strings are nice in JavaScript
    message.alert(
      `getValue DataType: ${typeof myData}; getNativeValue DataType: ${typeof myNativeData}`
    );
  }

  // Page specific namespace
  // As the file name is jsad_p0005.js, it hooks into namespace jsad
  // and adds it own sub-namespace p0005.
  // The filename implies, that this file is the sole source for the p0005 namespace.
  jsad.p0005 = {
    validateNumber: _validateNumber,
  };
  // Hand in parameters, in this case the referenced libraries/APIs
  // Makes it easier to understand dependencies
  // and allows own named parameters for shorter calls
})(apex.item, apex.message, apex.debug);
