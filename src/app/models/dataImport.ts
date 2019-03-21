export class DataImport {
    name: string;
    type: string;
    size: number;
    data: any;

    constructor(name, type, size){
        this.name = name;
        this.type = type;
        this.size = size;
        this.data = "";
    }
}
