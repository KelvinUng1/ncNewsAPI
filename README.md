# Northcoders News API
## Summary 
A backend news project which returns requests for fictional data on articles, comments and users.  
Built using JavaScript and PostgreSQL for database creation and data storage (hosted on ElephantSQL).

This project is hosted on Render:  
Access API [here](https://newsapp-aifw.onrender.com/api)  
The link will provide .json info on all endpoints available.

## Setup instructions


### Minimum requirements:
```
node.js - version ^10.13.0  
postgres - version ^8.7.3  
```  

## To run this project locally: 

 ### 1. Clone the repo
 ``` 
 git clone https://github.com/KelvinUng1/ncNewsAPI.git 
 ```  
 
  <br>

 ### 2. Install dependencies
 ```
 npm install
 ```

Package documentation:  
dotenv: https://www.npmjs.com/package/dotenv  
express: https://expressjs.com/  
jest: https://jestjs.io/docs/getting-started  
pg: https://www.npmjs.com/package/pg  
fs: https://nodejs.org/api/fs.html  

<br>
 
 ### 3. Create `.env.dev` & `.env.test` files in the root folder in order to successfully connect to the two databases:
 ```
 PGDATABASE=$database_name_here$
 ```
 ```
 PGDATABASE=$test_database_name_here$
 ```
 `/db/setup.sql` contains the database names for each environment

 <br>

 ### 4. Setup and seed the database:
 ```
 npm run setup-dbs
 ```
 ```
 npm run seed
 ```

<br>

# Testing
### To run the test suite:
```
npm run test
```


 