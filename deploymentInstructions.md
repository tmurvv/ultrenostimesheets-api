This app is run on Digital Ocean Server account tmurv@shaw.ca 143.198.188.28
See One Note/clients for passwords
ssh root@143.198.188.28
FE = /var/www/timesheets.ultrenos.ca/html
FE URL = timesheets.ultrenos.ca
BE = /app/ultrenos/ultrenostimesheets-api
BE URL = timesheets-api.ultrenos.ca (as of 2021, running on port 7050)

## logs
ssh 143.198.188.28 (on client)
pm2 logs

## to deploy production
check that config.env port is 7050
git push all changes
ssh root@143.198.188.28
cd apps/ultrenos/utlrenostimesheets-api
git pull
check that config.env port is 7050

## to deploy Staging
- staging version at subdomain: timesheets-staging-api.ultrenos.ca
- port: 7051
- staging version uses ultrenos-portfolio db
- git push all changes
- ssh root@143.198.188.28
- cd apps/ultrenos/ultrenostimesheets-staging-api/ultrenostimesheets-api
- git reset --hard
- git pull
- if new changes involve config or index, the staging version of these files should be updated in parent directory
- copy config.env and index-stg.js from parent directory
### STAGING VERSION SHOULD BE STARTED AND STOPPED ON BACKEND
- from dir apps/ultrenos/ultrenostimesheets-staging-api/ultrenostimesheets-api
- command is: pm2 start index-stg.js
- to check: pm2 status
- to stop, use index in status list: pm2 stop 2 // for example

## Portfolio
- portfolio version at subdomain: portfolio.ultrenostimesheets-api.ca
- port: 5050
