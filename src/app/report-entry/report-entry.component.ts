import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Report } from '../models/report.model'
import { MD5 } from 'crypto-js';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-entry',
  templateUrl: './report-entry.component.html',
  styleUrls: ['./report-entry.component.css']
})
export class ReportEntryComponent {
  @Input() report!:Report;
  @Output() delete = new EventEmitter()

  constructor(private router:Router, private rs:ReportService){
  }
  onDelete(event:any, reportTime:Date):void{
    if(MD5((prompt("Enter the password") as string)).toString() == "fcab0453879a2b2281bc5073e3f5fe54"){
      if(window.confirm("Are you sure you want to delete this report?")){
          //allow report to be deleted
          event['delete_report'] = reportTime;
          this.delete.emit(event);
      }
    }
    else{
      window.alert("Incorrect password");
    }
  }

  onEdit(){
    this.router.navigate(['/report', this.report.reportTime.getTime()])
  }

  // statusUpdate(event:any){
  //   let time:number = event['status_chg']
  //   this.report = this.rs.getByTime(time) as Report;
  //   this.status = this.report.status == true?"Open":"Closed";
  //   console.log(this.status);
  //   console.log(this.report);
  // }
}
