import { Location } from './location.model'
export class Report{
    //id:number;
    //static numReports:number = 0;
    //note that status=true indicates the case is open

    constructor(public location:Location, public baddieName:string, public reportedBy:string, 
        public reportedByPhoneNumber:number, public extraInfo:string, public imageURL:string,
        public reportTime:Date = new Date(), public status = true){
        //this.id = Report.numReports;
        //Report.numReports++;
    }
}