
# Simple Notes API

## Create a note, enjoy a secure note
### The application allows you to create a note with an expiration date, You can also update the password, delete note or download the markdown file with the note to your computer.

### For some API spec see open-api.yml

### Tech stack
- AWS Cloud (AWS Lambda, DynamoDB, API Gateway, S3) :cloud:
- Serverless framework :zap:
- TypeScript :rocket:
- Node.js :snake:


### Deploy application
- create AWS profile `note`, which will allow you to deploy your application from scratch 
- in `serverless/custom.yml` change exportS3 or add something to make the name unique
- run `npm i` to install dependencies
- run `npm run deploy` and enjoy the application

### Local development
- create AWS profile `note`, which will allow you to deploy your application from scratch 
- run `npm i` to install dependencies
- run `npm run dev` to start local server that will communicate with the deployed AWS infrastructure so yeah, you need to deploy it first