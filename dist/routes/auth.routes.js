"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const security_middleware_1 = require("../middlewares/security.middleware");
const audit_middleware_1 = require("../middlewares/audit.middleware");
const router = (0, express_1.Router)();
router.use(security_middleware_1.sanitizeInput);
router.use(security_middleware_1.validateContentType);
router.use(security_middleware_1.detectAttacks);
router.use(security_middleware_1.authRateLimit);
router.use(audit_middleware_1.auditAuthentication);
router.post('/request-pin', validation_middleware_1.authValidations.requestPin, auth_controller_1.AuthController.requestPin);
router.post('/verify-pin', validation_middleware_1.authValidations.verifyPin, auth_controller_1.AuthController.verifyPin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map