import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as L from 'leaflet';
import { ReportService } from '../report.service';
import { Location } from '../models/location.model';
import { Report } from '../models/report.model';

@Component({
  selector: 'app-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.css']
})

export class LocationSelectComponent {
  @Output() updateCoordinate = new EventEmitter();

  private map!:L.Map;
  private centriod: L.LatLngExpression = [49.288, -122.980]; // Burnaby
  private marker:L.Marker|null = null;

  

  private initMap():void{
    this.map = L.map('map', {
      center: this.centriod,
      zoom:11
    })
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 9,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    });
    tiles.addTo(this.map);

    this.map.on('click', (e) => {
      this.onMapClick(e);
    });
  }

  private onMapClick(e:any): void {
    const coordinates:L.LatLngExpression = e.latlng;
    e['coordinates']= coordinates;
    this.updateCoordinate.emit(e);
    // Remove the previous marker if it exists
    if (this.marker != null) {
      this.map.removeLayer(this.marker);
    }
    // Add a new marker to the map and store it in the marker field
    this.marker = L.marker(coordinates).addTo(this.map); 
  }

  ngOnInit():void{
    this.initMap();
    // this.loadReports();
  }

  constructor(private rs:ReportService){
  }

  locationLoad(name:string):void{
    const location:Location|undefined = this.rs.locationFind(name);
    if(location){
      // Remove the previous marker if it exists
      if (this.marker != null) {
        this.map.removeLayer(this.marker);
      }
      // Add a new marker to the map and store it in the marker field
      this.marker = L.marker(location.latLng).addTo(this.map);
    }
  }
}

