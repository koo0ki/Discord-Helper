import * as fs from 'fs';

export class BaseHandler {
    protected dir: string;

    constructor(dir: string) {
        this.dir = dir;
    }

    public getFiles(dir?: string): string[] {
        const directory = dir || this.dir;
        try {
            return fs.readdirSync(directory)
                .filter(file => file.endsWith('.ts'));
        } catch {
            return []
        }
    }

    public getDirectories(dir?: string): string[] {
        const directory = dir || this.dir;
        try {
            return fs.readdirSync(directory)
                .filter(item => fs.statSync(`${directory}/${item}`).isDirectory());
        } catch {
            return []
        }
    }
}