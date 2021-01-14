import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NgxCsvParserModule, NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { OrderService } from 'app/providers/order.service';
import { SettingsService, User } from '@core';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.scss']
})
export class NouvelleDemandeComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;



  formEnri = new FormGroup({
    filename: new FormControl('', Validators.required),
    action: new FormControl('A', Validators.required),
    client: new FormControl('', Validators.required),
    cible: new FormControl('', Validators.required),
    intermidiaire: new FormControl('', Validators.required),
    Amabis: new FormControl('N')

  });

  user: User;
  file: any;
  showFile = false;
  showFormulaire = false;
  showStats = false;
  loading = false;
  buttonName = "Start Enrichment";

  resultedColumns: string[] = ['myorder.mapping.adress1', 'myorder.mapping.adress2', 'myorder.mapping.adress3', 'myorder.mapping.adress4', 'myorder.mapping.adress5', 'myorder.mapping.adress6'];

 

  mappingColumns = [
     'N° colonne' ,'Nom colonne', 'Aperçu ligne 1' , 'variable correspondante'
  ]
  mappingDataSource: MatTableDataSource<FileElement>
  csvRecords: any[];
  resultsLength = 0;
  finalRecord = [];

  constructor(private ngxCsvParser: NgxCsvParser, private _snackBar: MatSnackBar, public dialog: MatDialog, public orderSrvice: OrderService, public settings: SettingsService, private toastr: ToastrService) {
    this.user = settings.user;
  }
  choisirCorrespondance(e, item) {
    alert ( e.target.value)
  }

  openAleert(error) {
    this._snackBar.open(error, 'ok', {
      duration: 3000,
    });
  }

  confirm() {
    this.showFile = false;
    this.showFormulaire = true;
  }
  validmapping() {

    return false;
  }

  ngOnInit(): void {
    this.mappingDataSource.paginator = this.paginator;
    
  }
  showmappage() {

    this.showFile = true;
  }

  get filename() {
    return this.formEnri.get('filename').value;
  }
  get action() {
    return this.formEnri.get('action').value;
  }
  get client() {
    return this.formEnri.get('client').value;
  }
  get cible() {
    return this.formEnri.get('cible').value;
  }
  get intermidiaire() {
  
    return this.formEnri.get('intermidiaire').value;
  }
  get Amabis() {
    return this.formEnri.get('Amabis').value;
  }

  createOrder() {
    let data = {
      filename: this.filename,
      intermidiaire: this.intermidiaire,
      client: this.client,
      type: this.action,
      media: this.cible,
      amabis: 'N',
      email : this.user.email,
      // adresse1 : this.ligne1.toString(),
      // adresse2 : this.ligne2.toString(),
      // adresse3 : this.ligne3.toString(),
      // adresse4:this.ligne4.toString(),
      // adresse5 : this.ligne5.toString(),
      // adresse6:this.ligne6.toString()
    };

    this.orderSrvice.createOrder(data).subscribe(res => {
      console.log(res)

      if(res.status === true) {
        const dialogConfig = new MatDialogConfig();
        this.dialog.open(DialogBodyComponent, dialogConfig)
      }
    })

  }
  sendFile() {

    const { Parser } = require('json2csv');
    const fields = ['myorder.mapping.adress1', 'myorder.mapping.adress2', 'myorder.mapping.adress3', 'myorder.mapping.adress4', 'myorder.mapping.adress5', 'myorder.mapping.adress6'];
    const opts = { fields };

    const json2csvParser = new Parser({ fields });

    const csv = json2csvParser.parse(this.finalRecord);

    this.orderSrvice.sendFile(this.file, this.formEnri.get('filename').value).subscribe(res => {
      if (res.status === true) {

        this.createOrder();

      }
    })


  }
  startEnrichiment() {

    if (this.formEnri.valid) {

    
      this.sendFile();
     

   
    }

  }

  reset() {


    this.resultsLength = 0;
  

    this.formEnri = new FormGroup({
      filename: new FormControl('', Validators.required),
      action: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
      cible: new FormControl('', Validators.required),
      intermidiaire: new FormControl('', Validators.required),
      Amabis: new FormControl('')

    });

    
    this.showFormulaire = false;
    this.showFile = false;

    this.csvRecords = [];
 
    this.file = null;
    this.finalRecord = [];
  

  }
  readFile(file: File) {
    this.ngxCsvParser.parse(file, { header: true, delimiter: ';' })
      .pipe().subscribe((result: Array<any>) => {

        this.csvRecords = [];
        this.csvRecords = result;
        var columnsIn = result[0];
       let todo = []
        for (var key in columnsIn) {
         todo.push(key);
        }
   
        
     
        let data =[] ;
        todo.forEach((item, indice) => {

          data.push({  'N° colonne' : indice +1 , 'Nom colonne' : item , 'Aperçu ligne 1' : this.csvRecords[0][item] 
             })
          
        });
     
        this.mappingDataSource = new MatTableDataSource(data) ;
        this.mappingDataSource.paginator = this.paginator;
  
        this.resultsLength = data.length;
       
      }, (error: NgxCSVParserError) => {
        this.showFile = false;

        this.openAleert(error.message)

      });
  }
 

  upload_file() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.onchange = () => {
     
      for (let index = 0; index < fileInput.files.length; index++) {

        this.file = fileInput.files[index];

        this.formEnri.get('filename').setValue(this.file.name);

      }
      this.readFile(this.file);

     

    };
    fileInput.click();
  }





}



export interface FileElement {

}