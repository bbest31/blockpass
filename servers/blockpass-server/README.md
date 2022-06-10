
---
## 1.Install
### MongoDB
> Download [MongoDB](https://www.mongodb.com/try/download/community) and make sure an instance is running.

### npm
```
npm i
```

## 2.Environment variables
```sh
NODE_ENV=development

PORT=8000

#AUTH0
AUTH0_ISSUER_BASE_URL=
AUTH0_BASE_URL=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

#Winston
LOG_LEVEL=debug
```

## 3.Start
### Run as dev using nodemon
```sh
npm run dev
```

---
## Dependencies
- express v4.18.1
- mongoose v6.3.4
- express-oauth2-jwt-bearer v1.1.0
- dotenv v16.0.1
- cors v2.8.5
- helmet v5.1.0
- auth0 v2.42.0
- winston v3.7.2

---
## Acknowledgements
- [express](https://mongoosejs.com/)
- [mongoose](https://expressjs.com/)
- [mongodb](https://www.mongodb.com/)
- [logrocket folder structure](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/)
- [express-oauth2-jwt-bearer](https://auth0.github.io/node-oauth2-jwt-bearer/)
- [cors](https://expressjs.com/en/resources/middleware/cors.html)
- [helmet](https://www.npmjs.com/package/helmet)
- [node-auth0](https://www.npmjs.com/package/auth0#user-content-management-api-client)
- [winston](https://github.com/winstonjs/winston/tree/2.x)