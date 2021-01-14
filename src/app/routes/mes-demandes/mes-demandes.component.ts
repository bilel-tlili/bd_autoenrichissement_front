import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelService } from 'app/providers/excel.service';
import { OrderService } from 'app/providers/order.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-mes-demandes',
  templateUrl: './mes-demandes.component.html',
  styleUrls: ['./mes-demandes.component.scss']
  
})
export class MesDemandesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  Orders : any = [] ;
  Columns = [] ;
  dataSource: MatTableDataSource<any>;
  hideresult = true ;
  media : any ;
  id : any ;
  fichier : any ;

  result : any ;
  constructor( public orderService : OrderService, public excellService : ExcelService) { }

  ngOnInit(): void {
    this.get_orders()
    this.hideresult = true ;
  setInterval(()=> {

    this.get_orders()
  },60000)
 
  }
  get_orders() {
    this.Orders = [] ;
    this.Columns = [] ;
    this.dataSource = new  MatTableDataSource<any>();
    this.orderService.getAllOrders().subscribe( res => {

    
    
      this.Orders = res.Orders ;
      this.Columns.push('actions')
      for (var key in this.Orders[0]) {

        if(key !== 'result') {
        this.Columns.push(key);
        }
      }
    
    
      this.dataSource = new MatTableDataSource(this.Orders);
      
      this.dataSource.paginator = this.paginator;
    })
  }


  showDetails(element) {
  
   this.hideresult = true ;

   if(element.result !== null && element.result !== '') {
   this.id = element.order_id
   this.media = element.media ;
   this.fichier = element.filename ;
    this.result = JSON.parse(element.result) ;
   
    if(this.media ==='email') {
      this.result.Valide_RNVPPercent = (this.result.Valide_RNVP * 100 / this.result.Lignes_en_entree ).toFixed(2)
      this.result.Personnes_avec_EmailPercent = (this.result.Personnes_avec_Email * 100 / this.result.Lignes_en_entree ).toFixed(2)
    } else {
      this.result.STATS_GLOB.Valide_RNVPPercent = (this.result.STATS_GLOB.Valide_RNVP * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2)
      this.result.STATS_GLOB.TelephonesPercent = (this.result.STATS_GLOB.Telephones * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2)
      this.result.STATS_GLOB.ActifsPercent = (this.result.STATS_GLOB.Actifs * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2)
      this.result.STATS_GLOB.SmsPercent = (this.result.STATS_GLOB.Sms * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2) 
      




      this.result.STATS_AAA.A_P_M.TOTAL_FIXE_ACTIF_PM = this.result.STATS_AAA.A_P_M.AMA_FIXE_ACTIF_PM + this.result.STATS_AAA.A_P_M.OPD_FIXE_ACTIF_PM 
      this.result.STATS_AAA.A_P_M.TOTAL_MOBI_ACTIF_PM = this.result.STATS_AAA.A_P_M.AMA_MOBI_ACTIF_PM + this.result.STATS_AAA.A_P_M.OPD_MOBI_ACTIF_PM 
      this.result.STATS_AAA.A_P_M.TOTAL_TEL_AMA_ACTIF_PM = this.result.STATS_AAA.A_P_M.AMA_MOBI_ACTIF_PM + this.result.STATS_AAA.A_P_M.AMA_FIXE_ACTIF_PM  
      this.result.STATS_AAA.A_P_M.TOTAL_TEL_OPD_ACTIF_PM =  this.result.STATS_AAA.A_P_M.OPD_MOBI_ACTIF_PM  + this.result.STATS_AAA.A_P_M.OPD_FIXE_ACTIF_PM 
      this.result.STATS_AAA.TOTAL_ACTIF_PM =   this.result.STATS_AAA.A_P_M.TOTAL_FIXE_ACTIF_PM  +  this.result.STATS_AAA.A_P_M.TOTAL_MOBI_ACTIF_PM

      this.result.STATS_AAA.A_P_F.TOTAL_FIXE_ACTIF_PF = this.result.STATS_AAA.A_P_F.AMA_FIXE_ACTIF_PF + this.result.STATS_AAA.A_P_F.OPD_FIXE_ACTIF_PF 
      this.result.STATS_AAA.A_P_F.TOTAL_MOBI_ACTIF_PF = this.result.STATS_AAA.A_P_F.AMA_MOBI_ACTIF_PF + this.result.STATS_AAA.A_P_F.OPD_MOBI_ACTIF_PF 
      this.result.STATS_AAA.A_P_F.TOTAL_TEL_AMA_ACTIF_PF = this.result.STATS_AAA.A_P_F.AMA_MOBI_ACTIF_PF + this.result.STATS_AAA.A_P_F.AMA_FIXE_ACTIF_PF  
      this.result.STATS_AAA.A_P_F.TOTAL_TEL_OPD_ACTIF_PF =  this.result.STATS_AAA.A_P_F.OPD_MOBI_ACTIF_PF  + this.result.STATS_AAA.A_P_F.OPD_FIXE_ACTIF_PF
      this.result.STATS_AAA.TOTAL_ACTIF_PF =   this.result.STATS_AAA.A_P_F.TOTAL_FIXE_ACTIF_PF  +  this.result.STATS_AAA.A_P_F.TOTAL_MOBI_ACTIF_PF

      this.result.STATS_AAA.F_P_M.TOTAL_FIXE_FID_PM = this.result.STATS_AAA.F_P_M.AMA_FIXE_FID_PM + this.result.STATS_AAA.F_P_M.OPD_FIXE_FID_PM 
      this.result.STATS_AAA.F_P_M.TOTAL_MOBI_FID_PM = this.result.STATS_AAA.F_P_M.AMA_MOBI_FID_PM + this.result.STATS_AAA.F_P_M.OPD_MOBI_FID_PM 
      this.result.STATS_AAA.F_P_M.TOTAL_TEL_AMA_FID_PM = this.result.STATS_AAA.F_P_M.AMA_MOBI_FID_PM + this.result.STATS_AAA.F_P_M.AMA_FIXE_FID_PM  
      this.result.STATS_AAA.F_P_M.TOTAL_TEL_OPD_FID_PM =  this.result.STATS_AAA.F_P_M.OPD_MOBI_FID_PM  + this.result.STATS_AAA.F_P_M.OPD_FIXE_FID_PM 
      this.result.STATS_AAA.TOTAL_FID_PM  =  this.result.STATS_AAA.F_P_M.TOTAL_FIXE_FID_PM  +  this.result.STATS_AAA.F_P_M.TOTAL_MOBI_FID_PM

      this.result.STATS_AAA.F_P_F.TOTAL_FIXE_FID_PF = this.result.STATS_AAA.F_P_F.AMA_FIXE_FID_PF + this.result.STATS_AAA.F_P_F.OPD_FIXE_FID_PF 
      this.result.STATS_AAA.F_P_F.TOTAL_MOBI_FID_PF = this.result.STATS_AAA.F_P_F.AMA_MOBI_FID_PF + this.result.STATS_AAA.F_P_F.OPD_MOBI_FID_PF 
      this.result.STATS_AAA.F_P_F.TOTAL_TEL_AMA_FID_PF = this.result.STATS_AAA.F_P_F.AMA_MOBI_FID_PF + this.result.STATS_AAA.F_P_F.AMA_FIXE_FID_PF  
      this.result.STATS_AAA.F_P_F.TOTAL_TEL_OPD_FID_PF =  this.result.STATS_AAA.F_P_F.OPD_MOBI_FID_PF  + this.result.STATS_AAA.F_P_F.OPD_FIXE_FID_PF
      this.result.STATS_AAA.TOTAL_FID_PF  =  this.result.STATS_AAA.F_P_F.TOTAL_FIXE_FID_PF  +  this.result.STATS_AAA.F_P_F.TOTAL_MOBI_FID_PF


      this.result.STATS_GLOB.FixePercent  = (this.result.STATS_AAA.F_P_F.TOTAL_FIXE_FID_PF * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2) 
      this.result.STATS_GLOB.FixeActifPercent = (this.result.STATS_AAA.A_P_F.TOTAL_FIXE_ACTIF_PF * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2) 
      this.result.STATS_GLOB.MobilePercent = (this.result.STATS_AAA.F_P_M.TOTAL_MOBI_FID_PM  * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2) 
      this.result.STATS_GLOB.MobileActifPercent = (this.result.STATS_AAA.A_P_M.TOTAL_MOBI_ACTIF_PM  * 100 / this.result.STATS_GLOB.Lignes_en_entree ).toFixed(2) 
    }
   
    this.hideresult = false ;
   }
  }

  applyFilter(event: Event) {
    this.hideresult = true ;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportExcell() {
/* table id is passed over here */   
// let element = document.getElementById('result'); 
// console.log(element)
// const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

// /* generate workbook and add the worksheet */
// const wb: XLSX.WorkBook = XLSX.utils.book_new();

// XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

// /* save to file */
// XLSX.writeFile(wb, "audit.xlsx") ;
  this.excellService.generateExcel(this.result,this.media, this.fichier);
  }
}
