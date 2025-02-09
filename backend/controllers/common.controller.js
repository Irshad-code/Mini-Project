const commonService = require("../services/common/common.services");
const { isEmptyList, handleError } = require("./util/controller.util");
const log4js = require("log4js");
const logger = log4js.getLogger("CommonController");

module.exports.welcome = async function (req, res) {
  logger.debug("I am logging req", req.baseUrl.substring(1));
  var result = await commonService.welcome(req.baseUrl.substring(1));
  return res.json(result);
};
module.exports.findByUserId = async function (req, res) {
  try {
    let id = req.query.id;
    logger.info(`request   ID: ${id}`);
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    var result = await commonService.findUserById(modelname, id);
    if (isEmptyList(result)) {
      return handleError(res, 404, "List not found");
    }
    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
module.exports.upsertByUserId = async function (req, res) {
  try {
    let id = req.query.id;
    logger.info(`request   ID: ${id}`);
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    const reqObject = req.body;
    logger.info(` request: ${JSON.stringify(reqObject)}`);
    let result = await commonService.upsertByUserId(modelname, id, reqObject);
    if (isEmptyList(result)) {
      return handleError(res, 404, " not saved");
    }
    return res
      .status(201)
      .json({ message: "Record inserted successfully", record: result });
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
module.exports.list = async function (req, res) {
  try {
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    logger.info(`Fetching  list for ${modelname}`);
    var result = await commonService.list(modelname, page, limit, req.query);
    if (isEmptyList(result)) {
      return handleError(res, 404, "result not found");
    }
    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
module.exports.completeList = async function (req, res) {
  try {
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    logger.info(`Fetching  list for ${modelname}`);
    var result = await commonService.completeList(modelname);
    if (isEmptyList(result)) {
      return handleError(res, 404, "result not found");
    }
    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
module.exports.findById = async function (req, res) {
  try {
    let id = req.params.id;
    logger.info(`request   ID: ${id}`);
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    var result = await commonService.getById(modelname, id);
    if (isEmptyList(result)) {
      return handleError(res, 404, "List not found");
    }
    return res.json(result);
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
module.exports.updateById = async function (req, res, next) {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const modelname = req.baseUrl.substring(1).toLowerCase();
    const updatedRecord = await commonService.updateById(
      modelname,
      id,
      updateData
    );
    if (isEmptyList(updatedRecord)) {
      return handleError(res, 404, "object not found");
    }
    res.status(200).json({ message: updatedRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports.deleteById = async function (req, res) {
  try {
    let id = req.params.id;
    logger.info(`request   ID: ${id}`);
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();

    var result = await commonService.deleteById(modelname, id);
    if (isEmptyList(result)) {
      return handleError(res, 404, "id not found");
    }
    res.json({ message: " deleted successfully" });
  } catch (error) {
    console.log(error)
    return handleError(
      res,
      500,
      "Internal server error from delete query",
      error
    );
  }
};
module.exports.create = async function (req, res) {
  try {
    logger.info("Creating new object");
    logger.debug("I am logging req", req.baseUrl.substring(1));
    const modelname = req.baseUrl.substring(1).toLowerCase();
    const reqObject = req.body;
    logger.info(` request: ${JSON.stringify(reqObject)}`);
    let result = await commonService.create(modelname, reqObject);
    if (isEmptyList(result)) {
      return handleError(res, 404, " not saved");
    }
    return res
      .status(201)
      .json({ message: "Record inserted successfully", record: result });
  } catch (error) {
    return handleError(res, 500, "Internal server error", error);
  }
};
