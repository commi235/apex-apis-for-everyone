// Create namespace or reuse existing
var jsad = jsad || {};

// encapsulate into an IFFE (https://en.wikipedia.org/wiki/Immediately_invoked_function_expression)
(function (item, message, locale, debug) {
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
    debug.info(
      `getValue DataType: ${typeof myData}; getNativeValue DataType: ${typeof myNativeData}`
    );

    var realValue;

    if (myNativeData) {
      debug.info("Using Native Value");
      // number directly, just use the value
      realValue = myNativeData;
    } else {
      debug.info("Using String");
      // We only get a string, so need to cast
      // Make sure you know the current NLS settings
      const decimalSeparator = locale.getDecimalSeparator();
      const groupSeparator = locale.getGroupSeparator();

      // I'm taking a shortcut here...
      // Just assuming we can strip the group separator
      // Don't do that in real code please...
      realValue = parseFloat(
        myData.replace(groupSeparator, "").replace(decimalSeparator, ".")
      );
    }

    if (!realValue) {
      message.alert("Sorry, could not read this value.");
    } else if (realValue < 1000) {
      message.alert("Thank you for choosing a sensible value");
    } else if (realValue < 2000) {
      message.alert("Well, it's still ok.");
    } else {
      message.alert("Come on, that's too much.");
    }
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
})(apex.item, apex.message, apex.locale, apex.debug);
