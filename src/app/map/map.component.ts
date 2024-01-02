import { Component } from '@angular/core';
import * as L from 'leaflet';
import { ReportService } from '../report.service';
import { Location } from '../models/location.model';
import { Report } from '../models/report.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  private map!:L.Map;
  private centriod: L.LatLngExpression = [49.230, -122.880]; // Burnaby
  private subscription!:Subscription; //subscribe to the report-list so the map is updated on deletion
  private markersLayer = L.layerGroup(); 
  

  private initMap():void{
    this.map = L.map('map', {
      center: this.centriod,
      zoom:10
    })
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 7,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    });
    tiles.addTo(this.map);
  }

  ngOnInit():void{
    this.initMap();
    this.loadReports();
    this.subscription = this.rs.reportDeleted$.subscribe(() => this.loadReports()); //subscribe so that the reports are reloaded upon deletion
  }

  private loadReports(){
    // const locationList:Location[] = this.rs.getLocationList();
    // for(let location of locationList){
    //   this.reportCount[location.name as keyof object] = (this.reportCount[location.name as keyof object] || 0) + 1;
    // }


    // Clear existing markers before adding new ones
    this.markersLayer.clearLayers();
    
    const reports:Report[] = this.rs.get();

    const reportCount:{ [key: string]: number } = this.rs.getReportCount();

    // Display each report on the map, and use the counter object to display count
    for(let report of reports){
      const count:number = reportCount[report.location.name]; 
      L.marker(report.location.latLng).addTo(this.markersLayer)
   		.bindPopup(`<b>${report.location.name}</b><br />${count} nuisance report${count != 1?'s':''}`);
    }
    this.markersLayer.addTo(this.map)
  }

  ngOnDestroy() {
    // Unsubscribe from the observable
    this.subscription.unsubscribe();
  }

  constructor(private rs:ReportService){
  }

}
