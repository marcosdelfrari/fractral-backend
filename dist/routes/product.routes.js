"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const security_middleware_1 = require("../middlewares/security.middleware");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const router = (0, express_1.Router)();
router.use(security_middleware_1.sanitizeInput);
router.use(security_middleware_1.validateContentType);
router.use(security_middleware_1.detectAttacks);
router.use((0, security_middleware_1.validatePayloadSize)(1024 * 1024));
router.get('/', product_controller_1.getAllProducts);
router.post('/', authorization_middleware_1.requireAdmin, validation_middleware_1.productValidations.createProduct, (0, audit_middleware_1.auditDataModifications)('product'), product_controller_1.createProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map