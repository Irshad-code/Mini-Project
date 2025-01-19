var mongoose = require("mongoose");
const log4js = require("log4js");
const logger = log4js.getLogger("Common Service");

const userModel = require("../../models/users/dbmodels/user.model");
const collegeModel = require("../../models/admin/colleges/dbmodels/college.model");
const departmentModel = require("../../models/admin/departments/dbmodels/department.model");
const userbasicinfoModel = require("../../models/users/dbmodels/user.basicinfo.model");
//access the models:

const modelHandlers = {
  users: userModel,
  colleges: collegeModel,
  departments: departmentModel,
  userbasicinfo: userbasicinfoModel,
};
const validParams = {
  //agencyfileuploads: ["year", "month", "agencyName", "status"],
};

const sortmethod = {
  users: { updatedAt: -1 },
};

const projectfieldsforList = {
  users: "-password",
};
const projectfields = {
  //agencies: "_id name",
  //products: "_id brandName",
};

async function findUserById(model, userId) {
  logger.info("inside findBy userid");
  model = removeapi(model);
  logger.info("model", model);
  logger.info("userId", userId);
  return await modelHandlers[model].findOne({
    userId: new mongoose.Types.ObjectId(userId),
  });
}
async function upsertByUserId(model, userId, data) {
  model = removeapi(model);
  logger.info("model", model);
  logger.info("modelHandler", modelHandlers[model]);
  logger.info("data stored", data);

  return await modelHandlers[model].findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    { $set: data },
    { upsert: true, new: true } // Upsert: create if not found, new: return updated document
  );
}

async function getapproximatecount(model) {
  model = removeapi(model);
  return await modelHandlers[model].estimatedDocumentCount();
}
async function completeList(model) {
  try {
    model = removeapi(model);
    logger.debug(`Fetching Complete List`);
    let filterCriteria = {};
    if (model === "announcements") {
      const currentDate = new Date();
      filterCriteria = {
        active: true,
        $or: [
          { expires_at: { $exists: false } },
          { expires_at: { $gte: currentDate } },
        ],
      };
    }
    const result = await modelHandlers[model]
      .find(filterCriteria)
      .select(projectfieldsforList[model])
      .sort(sortmethod[model])
      .exec();
    return result;
  } catch (error) {
    logger.error("Error in completelist:", error);
    throw new Error(error.message);
  }
}
async function list(model, page, limit, requestParams) {
  try {
    model = removeapi(model);
    logger.debug("request params: ", requestParams);
    let query = {};
    const modelValidParams = validParams[model] || [];
    for (const param in requestParams) {
      if (modelValidParams.includes(param)) {
        // Add the parameter to the query if it's a valid parameter for the model
        query[param] = requestParams[param];
      }
    }
    logger.debug("query :", query);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    logger.debug("Fetching all list");
    const items = await modelHandlers[model]
      .find(query)
      .select(projectfieldsforList[model])
      .sort(sortmethod[model])
      .limit(limit)
      .skip(startIndex)
      .exec();
    const totalItems = await modelHandlers[model].estimatedDocumentCount();
    const pagination = {};
    pagination.totalpages = Math.ceil(totalItems / limit);
    pagination.currentpage = page;
    pagination.pagesizelimit = limit;
    pagination.data = items;
    logger.debug(`Fetched ${items.length} ${model}`);
    return pagination;
  } catch (error) {
    logger.error("Error in list:", error);
    throw new Error(error.message);
  }
}
async function getById(model, id) {
  try {
    model = removeapi(model);
    logger.debug(`Fetching  by ID: ${id}`);
    var result = await modelHandlers[model].findById(id);
    return result;
  } catch (error) {
    logger.error(`Error in getById service ${model}`, error);
    throw new Error(error.message);
  }
}
async function deleteById(model, id) {
  try {
    model = removeapi(model);
    logger.debug(`Deleting  by ID: ${id} in model ${model}`);
    var result = await modelHandlers[model].findByIdAndDelete(id);
    logger.debug(`Deleted item in ${model}: ${result}`);
    return result;
  } catch (error) {
    logger.error("Error in deleteById service:", error);
    throw new Error(error.message);
  }
}
async function updateById(model, id, updateData) {
  try {
    model = removeapi(model);
    logger.debug(`Updating  by ID: ${id}`);
    const updatedResult = await modelHandlers[model].findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      }
    );
    logger.debug(`Updated result: ${updatedResult}`);
    if (model == "representatives") {
      CachedDataHandler.findreps();
    }
    return updatedResult;
  } catch (error) {
    logger.error("Error in updateById service:", error);
    throw new Error(error.message);
  }
}
async function create(model, input) {
  try {
    model = removeapi(model);
    logger.debug("model name :", model);
    logger.debug("Inserting object:", input);
    const newRecord = new modelHandlers[model](input);
    const recordSaved = await newRecord.save();
    return recordSaved;
  } catch (error) {
    logger.debug("Error in insert:", error);
    throw new Error(error.message);
  }
}
function removeapi(model) {
  logger.debug("model is ", model);

  if (model.startsWith("api/")) {
    model = model.slice(4); // Remove the "api/" part from the URL (first 4 characters)
  }
  if (model.startsWith("admin/")) {
    model = model.slice(6); // Remove the "api/" part from the URL (first 4 characters)
  }

  logger.debug("model is after ", model);
  return model;
}
module.exports = {
  list,
  getById,
  deleteById,
  updateById,
  create,
  completeList,
  getapproximatecount,
  findUserById,
  upsertByUserId,
};
