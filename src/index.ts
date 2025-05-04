import Koo0kiClient from "./struct/Client";
import * as config from './config'
import mongoose from "mongoose";
import Logger from "./struct/helpers/Logger";

console.clear()

mongoose.set('strictQuery', false)
mongoose.connect(config.mongoUrl, { autoIndex: true }).then(() => {
    new Logger().success('DataBase is connected')
    for (const data of config.clients) {
        new Koo0kiClient(data).init()
    }
})

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection');
    console.log(reason, p)
})
  
process.on("uncaughtException", (err, origin) => {
    console.log('Uncaught Exception');
    console.log(err, origin)
})
  
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Monitor Exception');
    console.log(err, origin)
})
