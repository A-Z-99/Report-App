import * as L from 'leaflet'
export class Location{
    constructor(public name:string, public latLng:L.LatLngExpression){}
}