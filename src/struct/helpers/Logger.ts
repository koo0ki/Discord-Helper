import colors from "colors";
import moment from "moment-timezone";

export default class Logger {
    log(text: string) {
        console.log(this.format() + colors.yellow('[LOG] ') + text)
    }

    info(text: string) {
        console.log(this.format() + colors.blue('[INFO] ') + text)
    }

    success(text: string) {
        console.log(this.format() + colors.green('[SUCCESS] ') + text)
    }

    error(err: Error | string, type: string = 'ERROR') {
        if(typeof err === 'string') {
            return console.log(this.format() + colors.red(`[${type}] `) + err)
        } else {
            return console.log(this.format() + colors.red(`[${type}] `) + `${err.name}: ${err.message}\n${err.stack}`)
        }
    }

    private format() {
        const time = moment(Date.now()).tz('Europe/Moscow').locale('ru-RU')
        return colors.cyan(`[${time.format('DD.MM.YYYY')} | ${time.format('HH:mm:ss')}] `)
    }
}