// const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DATABASE_PASSWORD
// );
// const DEVDB = process.env.DEV_DATABASE.replace(
//     '<PASSWORD>',
//     process.env.DEV_DATABASE_PASSWORD
// );

// const PORTDB = process.env.PORTFOLIO_DATABASE.replace(
//     '<PASSWORD>',
//     process.env.PORTFOLIO_DATABASE_PASSWORD
// );

// mongoose
//     .connect(PORTDB, {
//         useNewUrlParser: true,
//         useCreateIndex: true,
//         useFindAndModify: true,
//         useUnifiedTopology: true
//     })
//     .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`ultrenostimesheets running on port: ${port}...`);
});
// //fallback exception handler (will not handle exceptions above this line of code)
// process.on('uncaughtException', err => {
//     console.log('Uncaught Exception.');
//     console.log(err);
//     server.close(() => process.exit(1));
// });

// //fallback rejection handler
// process.on('unhandledRejection', err => {
//     console.log('Unhandled rejection.');
//     console.log(err.name, err.message);
//     server.close(() => process.exit(1));
// });
