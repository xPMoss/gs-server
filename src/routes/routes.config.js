


/*
app.post('/auth', [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login


    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    UsersController.list

]);
*/


app.get('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById

 ]);

 app.patch('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById

 ]);

 app.delete('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById

 ]);