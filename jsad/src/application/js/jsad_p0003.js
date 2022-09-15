// Create namespace or reuse existing
var jsad = jsad || {};

(function (message, lang, server, event, region, debug) {
  function _deleteEmployee(pElement, pOptions) {
    apex.debug.info("Inputs received", pElement, pOptions);
    let myElement = $(pElement);
    apex.debug.info("jQuery Element Object", myElement);

    let regionRefresh = false;
    if (!pOptions.refreshSelector) {
      regionRefresh = true;
      pOptions.refreshRegion = region.findClosest(pElement);
      debug.info("Using Region Refresh", pOptions.refreshRegion);
    }

    message.hidePageSuccess();
    message.confirm(
      lang.formatMessage(
        pOptions.confirmMessage,
        myElement.data(pOptions.nameField)
      ),
      function (okPressed) {
        if (okPressed) {
          let result = server.process(pOptions.processName, {
            x01: myElement.data(pOptions.idField),
            x02: myElement.data(pOptions.checksumField),
          });
          result.done(function (pData) {
            debug.info("Received Data", pData);
            if (regionRefresh) {
              pOptions.refreshRegion.refresh();
            } else {
              event.trigger(pOptions.refreshSelector, "apexrefresh");
            }
            if (pData.success) {
              message.showPageSuccess(pData.data.successMessage);
            } else {
              message.showErrors({
                type: "error",
                location: "page",
                message: pData.data.errorMessage,
                unsafe: false,
              });
            }
          });
        }
      }
    );
  }

  jsad.p0003 = {
    deleteEmployee: _deleteEmployee,
  };
})(apex.message, apex.lang, apex.server, apex.event, apex.region, apex.debug);
