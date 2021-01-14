import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.scss']
})
export class DialogBodyComponent  {

  constructor( public dialogRef: MatDialogRef<DialogBodyComponent>){}

  close() {
    this.dialogRef.close({"status" : "ok"});
  }
}
