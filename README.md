# Mobile Timesheet Entry - BE
This web app is targeted to construction workers for Ultimate Renovations, a Canadian company with multiple 'Best in Renovation' awards. The company needed a simple, fast way for their workers to enter hours at the end of the work-day while still at the construction job-site.

## Additional Features
This level of customization would not be possible with off-the-shelf software:

- Dynamically updates the job-site selection box on the timesheet entry to reflect a constantly changing list of clients
- Emails a reminder if a timesheet has not been entered by a worker for more than three business days. Implemented with a cron job.
- An api provides end points to download timesheets.
- At the request of the company, timesheets are available to be updated and deleted by the worker for 24 hours after being entered. Then the worker may view timesheets, but needs to contact the office to update.
- Website designed and developed by Tisha Murvihill, www.take2tech.ca

July 2021

Built with React, Nodejs, MongoDB. Backend hosted on an Ubuntu server. Front-end hosted on take2tech.ca

Dev files located at: https://github.com/tmurvv/
