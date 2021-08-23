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

## to deploy
check that config.env port is 7050
git push all changes
ssh root@143.198.188.28
cd apps/ultrenos/utlrenostimesheets-api
git pull
check that config.env port is 7050

## Production
- production version at ultrenostimesheets-api.ca
- port: 7050 (as of 2021)



## Staging
STAGING VERSION SHOULD BE STARTED AND STOPPED ON BACKEND
- staging version at subdomain: staging.ultrenostimesheets-api.ca
- port: 6050
- ssh over there: ssh 143.198.188.28 (on client)
- navigate to apps/testing/ultrenostimesheets-api.ca
- command is: pm2 start index.js
- to check: pm2 status
- to stop, use index in status list: pm2 stop 2 // for example

## Portfolio
- portfolio version at subdomain: portfolio.ultrenostimesheets-api.ca
- port: 5050
