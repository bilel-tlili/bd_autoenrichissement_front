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

@Component({
  selector: 'app-nouvelle-demande',
  templateUrl: './nouvelle-demande.component.html',
  styleUrls: ['./nouvelle-demande.component.scss']
})
export class NouvelleDemandeComponent implements OnInit {

  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator2: MatPaginator;


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
  displayedColumns: string[];
  resultedColumns: string[] = ['myorder.mapping.adress1', 'myorder.mapping.adress2', 'myorder.mapping.adress3', 'myorder.mapping.adress4', 'myorder.mapping.adress5', 'myorder.mapping.adress6'];
  dataSource: MatTableDataSource<FileElement>;
  dataSource2: MatTableDataSource<FileElement>;
  todo = [

  ];
  mappingColumns = [
     'N° colonne' ,'Nom colonne', 'Aperçu colonne' , 'variable correspondante'
  ]
  mappingDataSource: MatTableDataSource<FileElement>

  ligne1 = []
  ligne2 = []
  ligne3 = [];
  ligne4 = [];
  ligne5 = [];
  ligne6 = [];
  csvRecords: any[];
  resultsLength = 0;
  resultsLength1 = 0;
  finalRecord = [];


  constructor(private ngxCsvParser: NgxCsvParser, private _snackBar: MatSnackBar, public dialog: MatDialog, public orderSrvice: OrderService, public settings: SettingsService, private toastr: ToastrService) {
    this.user = settings.user;
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

    if (this.ligne6.length > 0 && this.ligne4.length > 0 && this.ligne1.length > 0) {
      return true
    }
    return false;
  }
  drop(event: CdkDragDrop<string[]>) {

    if (event.previousContainer === event.container) {


      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);



    } else {


      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);




      this.finalRecord = [];

      this.csvRecords.forEach(element => {

        let records = []

        this.resultedColumns.forEach((column, i) => {


          let recordligne = "";

          this['ligne' + (i + 1)].forEach(item => {

            recordligne += " " + element[item]

          });
          records.push(recordligne)


        });



        this.finalRecord.push({ [this.resultedColumns[0]]: records[0], [this.resultedColumns[1]]: records[1], [this.resultedColumns[2]]: records[2], [this.resultedColumns[3]]: records[3], [this.resultedColumns[4]]: records[4], [this.resultedColumns[5]]: records[5] })






      });
      this.dataSource2 = new MatTableDataSource(this.finalRecord);


      this.dataSource2.paginator = this.paginator2;
      this.resultsLength1 = this.finalRecord.length;


    }

    this.validmapping();


  }
  ngOnInit(): void {
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
    console.log( this.formEnri.get('intermidiaire').value)
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
      adresse1 : this.ligne1.toString(),
      adresse2 : this.ligne2.toString(),
      adresse3 : this.ligne3.toString(),
      adresse4:this.ligne4.toString(),
      adresse5 : this.ligne5.toString(),
      adresse6:this.ligne6.toString()
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
    this.resultsLength1 = 0;

    this.formEnri = new FormGroup({
      filename: new FormControl('', Validators.required),
      action: new FormControl('', Validators.required),
      client: new FormControl('', Validators.required),
      cible: new FormControl('', Validators.required),
      intermidiaire: new FormControl('', Validators.required),
      Amabis: new FormControl('')

    });

    this.ligne1 = []
    this.ligne2 = []
    this.ligne3 = [];
    this.ligne4 = [];
    this.ligne5 = [];
    this.ligne6 = [];
    this.showFormulaire = false;
    this.showFile = false;

    this.csvRecords = [];
    this.displayedColumns = [];
    this.file = null;
    this.finalRecord = [];
    this.todo = [];

  }
  readFile(file: File) {
    this.ngxCsvParser.parse(file, { header: true, delimiter: ';' })
      .pipe().subscribe((result: Array<any>) => {

        this.csvRecords = [];
        this.csvRecords = result;
        var columnsIn = result[0];
        this.todo = []
        for (var key in columnsIn) {
          this.todo.push(key);
        }
        // this.displayedColumns = [];
        // this.displayedColumns = this.todo;
        // this.dataSource = new MatTableDataSource(this.csvRecords);
        // this.resultsLength = this.csvRecords.length;
        // // this.showFile = true ;
        // this.dataSource.paginator = this.paginator;
        let transpoded = this.transpose(this.csvRecords) ;
      
     
        let data =[] ;
        transpoded.forEach((item, indice) => {

          data.push({  'N° colonne' : indice +1 , 'Nom colonne' : this.todo[indice] , 'Aperçu colonne' : this.csvRecords[0][this.todo[indice]] , 'variable correspondante' : 'test'
             })
          
        });
  
        this.mappingDataSource = new MatTableDataSource(data) ;
        this.resultsLength = data.length;
        this.mappingDataSource.paginator = this.paginator;
      }, (error: NgxCSVParserError) => {
        this.showFile = false;

        this.openAleert(error.message)

      });
  }
  transpose(arr) {
    return Object.keys(arr[0]).map(function (c) {
        return arr.map(function (r) {
            return r[c];
        });
    });
}

  upload_file() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.onchange = () => {
      console.log(fileInput.files)
      for (let index = 0; index < fileInput.files.length; index++) {

        this.file = fileInput.files[index];

        this.formEnri.get('filename').setValue(this.file.name);

      }
      this.readFile(this.file);

      //  this.showFile = true ;

    };
    fileInput.click();
  }





}



export interface FileElement {

}