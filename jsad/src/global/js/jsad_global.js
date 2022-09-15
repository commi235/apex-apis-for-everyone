// namespace wiederverwenden oder anlegen
var jsad = jsad || {};

(function ($, region, debug) {
  var igModelcreate = "interactivegridviewmodelcreate";
  var igSaveAction = "save";
  var igGetActions = "getActions";

  jsad.ig = {
    setEditMode: _setEditMode,
    focusSearch: _focusSearch,
    listenForChange: _listenForChange,
    changeActionState: _changeActionState,
    applyDefaults: _applyDefaults,
    invokeSaveOnSet: _invokeSaveOnSet,
    gridDebug: _defaultGridOptions,
  };

  /**
   * Set the edit mode of the Grid and optionally force it
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   * @param {boolean} mode true (default) for edit mode on, false for off
   * @param {boolean} keep true (default) forces edit mode after save, false doesn't
   */
  function _setEditMode(regionStaticId, mode, keep) {
    // ohne mode gehen wir von true aus
    var _mode = mode || true;
    // wenn keep nicht spezifiziert wird schalten wir immer wieder in den edit Modus
    var _keep = keep || true;

    var ig$ = region(regionStaticId).widget();

    // Initiales setzen von Edit
    ig$.interactiveGrid(igGetActions).set("edit", _mode);

    if (_keep) {
      $(regionStaticId).on("interactivegridsave", function () {
        setTimeout(function () {
          ig$.interactiveGrid(igGetActions).set("edit", _mode);
        }, 50);
      });
    }
  }

  /**
   * Applies the defined defaults to a grid region.
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   */
  function _applyDefaults(regionStaticId) {
    _setEditMode(regionStaticId);
    _focusSearch(regionStaticId);
  }

  /**
   * Puts Focus on Interactive Grid Search Field
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   */
  function _focusSearch(regionStaticId) {
    var selector = "#" + regionStaticId + "_ig_toolbar_search_field";
    var searchField = $(selector);
    if (searchField.length) {
      setTimeout(function () {
        searchField.focus();
      }, 200);
    }
  }

  /**
   * Register with model change notifications
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   * @param {function} callback Function that is called for every change
   */
  function _listenForChange(regionStaticId, callback) {
    var existingModel = region(regionStaticId).call("getCurrentView").model;

    // Wenn bereits ein model da ist auf dieses reagieren
    if (existingModel) {
      existingModel.subscribe({
        onChange: function (type, change) {
          callback(existingModel, type, change, regionStaticId);
        },
      });
    }

    // Immer auf modelcreate hören
    $("#" + regionStaticId).on(igModelcreate, function (event, ui) {
      ui.model.subscribe({
        onChange: function (type, change) {
          callback(ui.model, type, change, regionStaticId);
        },
      });
    });
  }

  /**
   * Enables or disables given action
   * Used to control visual elements connected to given action.
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   * @param {string} actionName Action to control
   * @param {boolean} enabled true enables and false disables the action
   */
  function _changeActionState(regionStaticId, actionName, enabled) {
    var ig$ = region(regionStaticId).widget();
    var igActions = ig$.interactiveGrid(igGetActions);

    if (enabled) {
      igActions.enable(actionName);
    } else {
      igActions.disable(actionName);
    }
  }

  /**
   * Calls Interactive Grid "save" action whenever a change of type "set" occurs
   * @param {apex.model} model Model to operate on
   * @param {string} type Type of change
   * @param {object} change Data about the change
   * @param {string} regionStaticId Static ID of Interactive Grid Region
   */
  function _invokeSaveOnSet(model, type, change, regionStaticId) {
    if (type == "set") {
      region(regionStaticId).call(igGetActions).invoke(igSaveAction);
    }
  }

  function _defaultGridOptions(options) {
    debug.info("Grid Static ID", options.regionStaticId);
    debug.info("All Options", options);
    return options;
  }
})(apex.jQuery, apex.region, apex.debug);
