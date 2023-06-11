
---
## 1. Install
### MongoDB
* Download [MongoDB](https://www.mongodb.com/try/download/community) and make sure an instance is running.
* Ensure to also install Mongo Compass when it asks you for a graphical UI to view the db data.

### npm
```
npm i
```

## 2. Environment variables
```sh
NODE_ENV=development

PORT=8000

#AUTH0
AUTH0_ISSUER_BASE_URL=
AUTH0_BASE_URL=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

#MONGODB
MONGODB_CONNECT=

#Winston
LOG_LEVEL=debug

#Google Cloud Platform
GCLOUD_BUCKET_NAME=
GCLOUD_PROJECT_ID=
GCLOUD_CLIENT_EMAIL=
GCLOUD_PRIVATE_KEY=

#Web3
PROVIDER=
MORALIS_API_KEY=
EVM_CHAIN=MUMBAI
```

## 3. Start
### Faucets
- Mumbai https://mumbaifaucet.com/ | https://faucet.polygon.technology/
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
- multer v1.4.5-lts.1
- @google-cloud/storage v6.3.0
- mime-types v2.1.35
- fs v0.0.1-security
- web3 v1.8.2

---
## Acknowledgements
- [express](https://mongoosejs.com/)
- [mongoose](https://expressjs.com/)
- [mongodb](https://www.mongodb.com/)
- [logrocket folder structure](https://blog.logrocket.com/organizing-express-js-project-structure-better-productivity/)
- [express-oauth2-jwt-bearer](https://auth0.github.io/node-oauth2-jwt-bearer/)
- [cors](https://expressjs.com/en/resources/middleware/cors.html)
- [helmet](https://www.npmjs.com/package/helmet)
- [node-auth0](https://auth0.github.io/node-auth0/)
- [winston](https://github.com/winstonjs/winston/tree/2.x)
- [multer](https://github.com/expressjs/multer)
- [@google-cloud/storage](https://github.com/googleapis/nodejs-storage)
- [mime-types](https://github.com/jshttp/mime-types)
- [fs](https://www.npmjs.com/package/fs)
- [web3](https://www.npmjs.com/package/web3)