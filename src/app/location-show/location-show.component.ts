import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from '../report.service';
import { Report } from '../models/report.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-show',
  templateUrl: './location-show.component.html',
  styleUrls: ['./location-show.component.css']
})
export class LocationShowComponent {
  report:Report;
  time:number;
  private map!:L.Map;
  private centriod: L.LatLngExpression;

  

  private initMap():void{
    this.map = L.map('map', {
      center: this.centriod,
      zoom:12
    })
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 9,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ',
    });
    tiles.addTo(this.map);
  }

  ngOnInit():void{
    this.initMap();
    this.loadReport();
  }

  constructor(private ActivatedRoute:ActivatedRoute, private rs:ReportService){
    this.time =  this.ActivatedRoute.snapshot.params['time'];
    this.report = this.rs.getByTime(this.time as number) as Report;
    this.centriod = this.report.location.latLng;
  }

  private loadReport(){
    const reportCount:{ [key: string]: number } = this.rs.getReportCount();
    const count:number = reportCount[this.report.location.name];
    L.marker(this.report.location.latLng).addTo(this.map)
    		.bindPopup(`<b>${this.report.location.name}</b><br />${count} nuisance report${count != 1?'s':''}`);
  }
}
