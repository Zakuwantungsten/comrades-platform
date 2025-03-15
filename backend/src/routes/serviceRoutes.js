import createService from "../controllers/services/createServiceCtrl";
import deleteService from "../controllers/services/deleteServiceCtrl";
import getServiceById from "../controllers/services/getServiceById";
import getServicesByProvider from "../controllers/services/getServiceByProviderCtrl";
import updateService from "../controllers/services/updateServiceCtrl";
import getServices from "../controllers/services/getServiceCtrl";

import express from "express";
//import {protect , admin } from "../middleware/authMiddleware";

const serviceRouter = express.Router();

serviceRouter.route("/").get(getServices).post( createService);
serviceRouter.route("/:id")
  .get(getServiceById)
  .delete( deleteService)
  .put( updateService);
serviceRouter.route("/provider/:id").get(getServicesByProvider);

serviceRouter.route("/all").get( getServices);
serviceRouter.route("/count").get( getServices);
serviceRouter.route("/stats").get( getServices);
serviceRouter.route("/top").get( getServices);