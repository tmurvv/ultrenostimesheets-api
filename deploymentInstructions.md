This app is run on Digital Ocean Server
See One Note/clients for passwords
ssh 143.198.188.28

## logs
ssh 143.198.188.28 (on client)
pm2 logs

## Production
- production version at ultrenostimesheets-api.ca
- port: 3000

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
