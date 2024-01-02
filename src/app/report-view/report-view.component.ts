import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { MD5 } from 'crypto-js';
import { Report } from '../models/report.model';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.css']
})
export class ReportViewComponent {
  // @Output() statusChange = new EventEmitter();
  report:Report;
  time:number;

  constructor(private ActivatedRoute:ActivatedRoute, private rs:ReportService, private router:Router){
    this.time =  this.ActivatedRoute.snapshot.params['time'];
    this.report = this.rs.getByTime(this.time as number) as Report;
    if (this.report === undefined){
      this.router.navigate(['/main-page']);
    }
  }

  changeStatus(event:any):void{
    if(MD5((prompt("Enter the password") as string)).toString() == "fcab0453879a2b2281bc5073e3f5fe54"){
      this.rs.changeStatus(this.time as number);
      // event['status_chg'] = this.time as number;
      // this.statusChange.emit(event);
    }
    else{
      window.alert("Incorrect password");
    }
  }

}
