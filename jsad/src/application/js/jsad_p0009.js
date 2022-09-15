// Create namespace or reuse existing
var jsad = jsad || {};

(function (debug) {
  const checkField = "IGDF_NEEDS_ATTENTION";
  const validateFields = ["IGDF_REMARK", "IGDF_ACTION"];

  function _setValidity(pModel, pRecordId, pField, pValid) {
    if (pValid) {
      pModel.setValidity("valid", pRecordId);
    } else {
      pModel.setValidity("error", pRecordId, pField, "Must not be empty.");
    }
  }

  function _validateRecord(pModel, pRecord) {
    let needsAttention = pModel.getValue(pRecord, checkField);
    validateFields.forEach((field) => {
      let isValid =
        needsAttention.v !== "Y" || pModel.getValue(pRecord, field) !== "";
      _setValidity(pModel, pModel.getRecordId(pRecord), field, isValid);
    });
  }

  function _checkValidity(pModel, pType, pChange, pRegionStaticId) {
    debug.info(
      "Entered checkValidity",
      pModel,
      pType,
      pChange,
      pRegionStaticId
    );
    if (pType == "copy") {
      pChange.records.forEach((record) => {
        _validateRecord(pModel, record);
      });
    } else if (pType == "set" || pType == "metaChange") {
      _validateRecord(pModel, pChange.record);
    }
  }

  jsad.p0009 = {
    checkValidity: _checkValidity,
  };
})(apex.debug);
