import { Component } from '@angular/core';
import { ReportService } from '../report.service';
import { Report } from '../models/report.model';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent {
  reports:Report[];

  constructor(private rs:ReportService){
    this.reports = [];
  }

  ngOnInit(): void {
    this.reports = this.rs.get()
  }

  onReportDelete(event:any){
    let delete_report = event['delete_report'];
    this.reports = this.rs.delete(delete_report);
    this.rs.triggerMapReload();
  }

  sortBy(event:any, key:string){
    this.reports = this.rs.sortBy(key);
  }
}
