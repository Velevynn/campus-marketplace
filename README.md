**README Instructions**

**--- Environment Setup ---**
1. npm install (to download dependences)
2. download .env file for frontend and backend (ask dev)
3. to test navigate to backend directory (cd .\express-backend) then test (npm test)

**Running the website**
1. For development set these variables for the REACT_APP_BACKEND_LINK, REACT_APP_FRONTEND_LINK to localhost:
   Ex: REACT_APP_BACKEND_LINK=http://localhost:8000
       REACT_APP_FRONTEND_LINK=http://localhost:3000
2. Otherwise, use the deployment links. It takes some time for pushed commits to deploy to the servers

**--- Style Guide ---**
 "Double Quotes"  
 lowerCamelCase()  
 curlyBraces(){  
 const variableNames;  
 }

**--- Prettier Instructions ---**
 should automatically run with every commit.
 - to manually run, use this script:  
 ./node\*modules/.bin/prettier --write "src/\*\*/\_.{js,jsx,ts,tsx,json,css,scss,md}"
 you can also download the prettier plugin, but make sure to configure the settings to the requirements above:
 - then simply save or use the command "SHIFT + ALT + F" to automatically format

**-- ESLint Instructions --** 
 run manually on files with this syntax:  
 npx eslint yourfile.js

**--- Product Spec ---**

https://docs.google.com/document/d/1q0nC7W3DTViva0hseFEp7Kv1w5NV9NboWGGN5qR_MrE/edit?usp=sharing

<img width="620" alt="image" src="https://github.com/Velevynn/haggle/assets/113927390/f92690a1-46d0-4284-9858-15deabe1a7ec">
Date ran: 03/17/2024
Time Ran: 6:10pm
*minimal s3 coverage since it's just a function which uploads to the s3 bucket and we couldn't find a way to mock the s3 upload*
