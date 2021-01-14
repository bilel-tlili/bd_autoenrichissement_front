import { Component, OnInit } from '@angular/core';


import { MesDemandesService } from './mesdemandes.service';


@Component({
  selector: 'app-historique-mesdemandes',
  templateUrl: './mesdemandes.component.html',
  providers: [MesDemandesService],
})
export class MesDemandesComponent implements OnInit {


  


  constructor() {}

  ngOnInit() {
  
  }

 
}
