import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportService } from '../report.service';
import { Router } from '@angular/router';
import { Report } from '../models/report.model'
import { Location } from '../models/location.model'
import { LatLngExpression } from 'leaflet';
import { ViewChild } from '@angular/core';
import { LocationSelectComponent } from '../location-select/location-select.component';

interface Form{
  imageURL:string;
  location:string;
  baddieName:string;
  reportedBy:string;
  reportedByPhoneNumber:number;
  extraInfo:string;
  coordinates:LatLngExpression;
}

@Component({
  selector: 'app-report-add',
  templateUrl: './report-add.component.html',
  styleUrls: ['./report-add.component.css']
})
export class ReportAddComponent {
  @ViewChild('locationSelectComponent') locationSelectComponent!: LocationSelectComponent;
  form: FormGroup;
  locationList!: Location[];

  knownLocation:boolean = false;

  constructor(private rs:ReportService, private router:Router) {
    let formControls = {
      location: new FormControl('', [Validators.required]),
      baddieName: new FormControl('', [Validators.required]),
      reportedBy: new FormControl('', [Validators.required]),
      reportedByPhoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^[\s\d-]{10,}$/)]),
      extraInfo: new FormControl(''),
      imageURL: new FormControl('', [Validators.pattern(/\./)]),
      coordinates: new FormControl('', [Validators.required]) // User selects coordinates on the map
    };

    this.form = new FormGroup(formControls);
  }

  ngOnInit():void{
    this.locationList = this.rs.getLocationList();
  }

  onSubmit(formInfo:Form){
    // if(typeof formInfo.imageURL == "string" && formInfo.imageURL != ""){
    //   this.rs.add(new Report(new Location(formInfo.location, [0,0]),formInfo.baddieName,formInfo.reportedBy, formInfo.reportedByPhoneNumber, formInfo.extraInfo, formInfo.imageURL));
    // }
    // else{
    //   this.rs.add(new Report(new Location(formInfo.location, [0,0]),formInfo.baddieName,formInfo.reportedBy, formInfo.reportedByPhoneNumber, formInfo.extraInfo));
    // }

    if(formInfo.imageURL === undefined){
      formInfo.imageURL = "";
    }
    if(formInfo.extraInfo === undefined){
      formInfo.extraInfo = "";
    }
    this.rs.add(new Report(new Location(formInfo.location, formInfo.coordinates),formInfo.baddieName,
      formInfo.reportedBy, formInfo.reportedByPhoneNumber, formInfo.extraInfo, formInfo.imageURL));


    this.router.navigate(["/main-page"])
  }

  onUpdateCoordinate(event:any){
    let coordinates:LatLngExpression = event['coordinates'];
    this.form.controls['coordinates'].setValue(coordinates);
  }

  locationLoad(){
    const selectedLocation:string = this.form.value.location;
    const coordinates:LatLngExpression|undefined = this.rs.locationFind(selectedLocation)?.latLng;
    if (coordinates){
      this.form.controls['coordinates'].setValue(coordinates);
      this.locationSelectComponent.locationLoad(selectedLocation);
    }
  }
}
