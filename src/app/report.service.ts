import { Injectable } from '@angular/core';
import { Report } from './models/report.model'
import { Location } from './models/location.model'
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  reports:Report[] = [];
  // numReports:number = 0;
  sortedBy:string;
  ascendingOrder:boolean;
  locationList:Location[];
  // Store the number of reports with the same location name
  reportCount: { [key: string]: number } = {}; // declare the object will have key of string and value of number

  //API key has been removed for security purposes
  private apiKey:string = 'Your API key here';
  private apiUrl:string = `https://272.selfip.net/apps/${this.apiKey}/collections/`;  

  // Tracks deletion of a location for the map
  private reportDeletedSubject = new Subject<void>();
  reportDeleted$ = this.reportDeletedSubject.asObservable();

  triggerMapReload() {
    this.reportDeletedSubject.next();  // Emit a generic event to be detected by map.component
  }

  // load in reports, locationList, and reportCount
  constructor(private http:HttpClient) { 
    this.sortedBy = "";
    this.ascendingOrder = false;
    this.locationList = [];


    /* Get request with parse for reports*/
    this.http.get<Object[]>(`${this.apiUrl}reports/documents/`).subscribe(reportArr => {
      interface reportObject{
        data:string;
      }
      reportArr.forEach((obj)=>{
        const item:Report = JSON.parse(((obj as unknown) as reportObject).data);
  
        //repack item into the report Object
        const report:Report = new Report(new Location(item.location.name, item.location.latLng), item.baddieName, item.reportedBy, item.reportedByPhoneNumber,
          item.extraInfo, item.imageURL, new Date(item.reportTime), item.status)
  
        this.reports.push(report);      
      });
      this.sortBy('reportTime');

      // Need to trigger map reload once we have the data
      this.triggerMapReload();
    });

    /* Get request with parse for locations*/
    this.http.get<Object[]>(`${this.apiUrl}locations/documents/`).subscribe(reportArr => {
      interface locationObject{
        data:string;
      }
      reportArr.forEach((obj)=>{
        const item:Location = JSON.parse(((obj as unknown) as locationObject).data);
  
        //repack item into the Location Object and push to the list
        const location:Location = new Location(item.name, item.latLng);
        this.locationList.push(location);      
      });
    });

    /* Get request with parse for reportCount*/
    this.http.get<Object[]>(`${this.apiUrl}reportCount/documents/myReportCount/`).subscribe(reportCount => {
      interface reportCountObject{
        data:string;
      }
      const item:{ [key: string]: number } = JSON.parse(((reportCount as unknown) as reportCountObject).data);
      // load the item into this.reportCount
      this.reportCount = item;

      // Need to trigger map reload once we have the reportCount data
      this.triggerMapReload();
    });

  }

  get():Report[]{

    return this.reports;
  }

  getLocationList():Location[]{
    return this.locationList;
  }

  locationFind(name:string):Location|undefined{
    return this.locationList.find((location) => location.name == name) as Location;
  }

  getReportCount():{ [key: string]: number }{
    return this.reportCount;
  }

  //requires server call
  add(newReport:Report){
    this.reports.push(newReport);
    this.ascendingOrder = false;
    this.sortBy('reportTime');
    // increment the counter object
    this.reportCount[newReport.location.name as keyof object] = (this.reportCount[newReport.location.name as keyof object] || 0) + 1;

    
        /* Post Request with stringify for reportCount*/
    this.http.put<Object>(`${this.apiUrl}reportCount/documents/myReportCount`,
      {
        'key':"myReportCount",
        'data':JSON.stringify(this.reportCount)
      }
    ).subscribe(response => {
      // console.log('PUT success:', response);
      // Handle success, if needed
    }, error => {
      console.error('PUT error:', error);
      // Handle error, if needed
    });

    // add to locationList if location.name is unique
    if(!this.locationList.find((location) => location.name == newReport.location.name)){
      this.locationAdd(newReport.location);
    }

    const slug:string = newReport.reportTime.toISOString().replace(/[-:.]/g, '_');
        /* Post Request with stringify for locationList*/
    this.http.post<Object>(`${this.apiUrl}reports/documents/`,
      {
        'key':slug,
        'data':JSON.stringify(newReport)
      }
    ).subscribe(response => {
      // console.log('POST success:', response);
      // Handle success, if needed
    }, error => {
      console.error('POST error:', error);
      // Handle error, if needed
    });
  }

  // requires server call
  locationAdd(newLocation:Location){
    this.locationList.push(newLocation);

    const slug:string = newLocation.name.replace(/[^a-zA-Z0-9]/g, '_');
        /* Post Request with stringify for location*/
    this.http.post<Object>(`${this.apiUrl}locations/documents/`,
      {
        'key':slug,
        'data':JSON.stringify(newLocation)
      }
    ).subscribe(response => {
      // console.log('POST success:', response);
      // Handle success, if needed
    }, error => {
      console.error('POST error:', error);
      // Handle error, if needed
    });
  }

  // requires server call
  delete(reportTime:Date):Report[]{

    ///* NOTE: the decrement step must be done before deletion*/

    // find report and decrement the counter object
    const report:Report = this.getByTime(reportTime.getTime()) as Report;
    this.reportCount[report.location.name as keyof object] = (this.reportCount[report.location.name as keyof object]) - 1;

    // Do the same for the server-side data with a put request
        /* Put Request with stringify*/
    this.http.put<Object>(`${this.apiUrl}reportCount/documents/myReportCount`,
      {
        'key':"myReportCount",
        'data':JSON.stringify(this.reportCount)
      }
    ).subscribe(response => {
      // console.log('PUT success:', response);
      // Handle success, if needed
    }, error => {
      console.error('PUT error:', error);
      // Handle error, if needed
    });


    // Remove the report
    this.reports = this.reports.filter(report => report.reportTime != reportTime);

        /* Delete request on a document */
    const slug:string = reportTime.toISOString().replace(/[-:.]/g, '_');
    this.http.delete<Object>(`${this.apiUrl}reports/documents/${slug}`)
    .subscribe(response => {
      // console.log('Delete success:', response);
      // Handle success, if needed
    }, error => {
      console.error('Delete error:', error);
      // Handle error, if needed
    });

    return this.reports;
  }

  sortBy(key:string):Report[]{
    //sort in ascending order
    if(this.ascendingOrder == false || this.sortedBy != key){
      this.reports = this.reports.sort((a,b)=> {       
        const valueA = a[key as keyof Report];
        const valueB = b[key as keyof Report];
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            // Case-insensitive string comparison
            return valueA.localeCompare(valueB);
        } else if(typeof valueA == 'boolean' && typeof valueB == 'boolean'){
            // Status comparison
            return valueA == true && valueB == false? -1: valueA == valueB? 0:1;
        } else if (valueA instanceof Date && valueB instanceof Date) {
            // Date comparison
            return valueA.getTime() - valueB.getTime();
        } else if(key === 'location'){
            // Location comparison
            return (valueA as Location).name.localeCompare((valueB as Location).name);
        } else {
            // Fallback to default comparison for other types
            return (valueA as any) < (valueB as any) ? -1 : (valueA as any) > (valueB as any) ? 1 : 0;
        }
      });
      this.ascendingOrder = true;
    }
    // sort in descending order
    else{
      this.reports = this.reports.sort((a,b)=> {
        const valueA = b[key as keyof Report];
        const valueB = a[key as keyof Report];
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            // Case-insensitive string comparison
            return valueA.localeCompare(valueB);
        } else if(typeof valueA == 'boolean' && typeof valueB == 'boolean'){
            // Status comparison
            return valueA == true && valueB == false? -1: valueA == valueB? 0:1;
        } else if (valueA instanceof Date && valueB instanceof Date) {
            // Date comparison
            return valueA.getTime() - valueB.getTime();
        } else if(key === 'location'){
            // Location comparison
            return (valueA as Location).name.localeCompare((valueB as Location).name);
        } else {
            // Fallback to default comparison for other types
            return (valueA as any) < (valueB as any) ? -1 : (valueA as any) > (valueB as any) ? 1 : 0;
        }
      });
      this.ascendingOrder = false;
    }
    this.sortedBy = key;
    return this.reports;
  }

  // requires server call
  changeStatus(time:number):Report[]{ //find the report with the given date and swap its status
    const foundReportIndex:number = this.reports.findIndex(report => report.reportTime.getTime() == time);

    if (foundReportIndex !== -1) {
      // Swap the status of the found report
      this.reports[foundReportIndex].status = !this.reports[foundReportIndex].status;

      // Do the same for the server-side data with a put request
      const slug:string = this.reports[foundReportIndex].reportTime.toISOString().replace(/[-:.]/g, '_');
          /* Put Request with stringify*/
      this.http.put<Object>(`${this.apiUrl}reports/documents/${slug}`,
        {
          'key':slug,
          'data':JSON.stringify(this.reports[foundReportIndex])
        }
      ).subscribe(response => {
        // console.log('PUT success:', response);
        // Handle success, if needed
      }, error => {
        console.error('PUT error:', error);
        // Handle error, if needed
      });


    }
    return this.reports;
  }

  getByTime(time:number):Report|undefined{
    const foundReportIndex:number = this.reports.findIndex(report => report.reportTime.getTime() == time);
    if (foundReportIndex !== -1) {
      return this.reports[foundReportIndex];
    }
    return undefined;
  }
}