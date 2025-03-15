import createService from "../controllers/services/createServiceCtrl.js";

import deleteService from "../controllers/services/deleteServiceCtrl.js";
import getServiceById from "../controllers/services/getServices/getServiceById.js";
import getServicesByProvider from "../controllers/services/getServices/getServiceByProviderCtrl.js";
import updateService from "../controllers/services/updateService.js";
import getServices from "../controllers/services/getServices/getServiceCtrl.js";

import express from "express";
import getAllServices from "../controllers/services/getServices/getAllServices.js";
//import {protect , admin } from "../middleware/authMiddleware.js";

const serviceRouter = express.Router();

serviceRouter.route("/").get(getServices).post( createService);
serviceRouter.route("/:id")
  .get(getServiceById)
  .delete( deleteService)
  .put( updateService);
serviceRouter.route("/provider/:id").get(getServicesByProvider);

serviceRouter.route("/all").get( getAllServices);
serviceRouter.route("/count").get( getServices);
serviceRouter.route("/stats").get( getServices);
serviceRouter.route("/top").get( getServices);

export default serviceRouter;