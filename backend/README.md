## Qodex [qodex-api]

Qodex is an opensource Q&A platform. 

**This repo hosts the backend.** Front end is available at: https://github.com/9OP/qodex-web

### Installation
*requires node 12.x, npm 6.x*

- Get the repo:
```
git clone https://github.com/9OP/qodex-api
```
- Install dependencies:
```
cd qodex-api
npm install
```
- Build and start server:
```
npm run build
npm start
```

The app should start and indicates its listenning port (8000 by default).

**Note:**
The mongodb database is hosted on Atlas mongo. To run the app you can either:
- create an Atlase account (free) and create a free cluster + admin user (easiest option)
- run a mongodb server on your own and connect to it

You have to provide a *.env* file (look at .env-template for the required information)
```
# API secret key
APP_PRIVATE_KEY=

# Mongo Atlas
DEV_DB=
PROD_DB=
DB_ADMIN_USERNAME=
DB_ADMIN_PASSWORD=
```

If you use VScode like me, install the REST Client plugin. You can then test the API with *requests.http* file, otherwise you can use Postman to test the API. 

Look at the API documentation to see what is consumed and produced.


### Dev env
*requires node 12.x, npm 6.x, mongo 4.x*

The dev env require you to run a mongodb locally (to run the tests). Follow the installation steps
and run the server in development mode:
- Run server in dev mode:
```
npm run dev
```
- Run lint and test:
```
npm run lint
npm run test
```

**18/06/2020:**
The tests have not been yet refactored, do not try to run them, they wont work.
I am working on getting them right + creating a CI gh action to run them before pushing on master.


### API documentation
API docs is comming.

### Deployment
Dockerfile is comming.

#### Manual
___
- Add Heroku remote:
```
heroku login
heroku git:remote --app=<HEROKU APP NAME>
```
- Setting heroku env from .env:
```
heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d') --app=<HEROKU APP NAME>
```
- Pushing to heroku:
```
git push heroku <LOCAL BRANCH>:master
```

Manual deployment is a burden. It is adviced to configure CD to deploy the app on master push.

#### Automatic
___
The easiest option for now is to use Heroku Github integration. Every push on master is deployed automatically to heroku.

### Licence
Comming soon.