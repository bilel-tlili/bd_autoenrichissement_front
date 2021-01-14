import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/providers/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  createUserForm: FormGroup;
  Users : any = [] ;
  Columns = [] ;
  dataSource: MatTableDataSource<any>;
  constructor(private fb: FormBuilder, private authService: AuthService ,  private toastr: ToastrService,) {
    this.init_form()
  }




  ngOnInit(): void {

    this.get_users()
  }
  init_form() {

    this.createUserForm = this.fb.group({
      lastname: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', []],
      entreprise: ['', [Validators.required]],
      job: [''],
      role: ['2', [Validators.required]]
    });
  }

  


  get email() {
    return this.createUserForm.get('email');
  }

  get firstname() {
    return this.createUserForm.get('firstname');
  }
  get lastname() {
    return this.createUserForm.get('lastname');
  }
  get phone() {
    return this.createUserForm.get('phone');
  }
  get role() {
    return this.createUserForm.get('role');
  }
  get entreprise() {
    return this.createUserForm.get('entreprise');
  }
  get job() {
    return this.createUserForm.get('job');
  }
  create_user() {
         
         let data = {"email": this.email.value , 'telephone' : this.phone.value , 'nom' : this.lastname.value , 'prenom' : this.firstname.value , 'societe' : this.entreprise.value , 'titre' :this.job.value , 'role' : this.role.value } 
         

         this.authService.createUser(data).subscribe( res => {
          
           this.toastr.info(` ${res.MESSAGE}` ,'',  {
         
            "positionClass": "toast-bottom-center",
         
            "timeOut": 1500,
            "extendedTimeOut": 1000,
            "closeButton": true,
            "progressBar": true,
            
          });
          this.get_users() ;

         })
        
        
     
         
  }

  get_users() {
    this.Users = [] ;
    this.Columns = [] ;
    this.dataSource = new  MatTableDataSource<any>();
    this.authService.getUsers().subscribe( res => {

    
    
      this.Users = res.USERS ;
     
      for (var key in this.Users[0]) {
        this.Columns.push(key);
      }
       this.Columns.push('actions')
      console.log(this.Columns)
      this.dataSource = new MatTableDataSource(this.Users);
      
      this.dataSource.paginator = this.paginator;
    })
  }
  generatePassword(id) {


    this.authService.generatePassword(id).subscribe( res => {
      if(res.status === true) {
        this.toastr.info(res.message,"Password Generation")
      }
    })
  }
  updateStatus(id) {
    this.authService.updateStatus(id).subscribe( res => {
      if(res.status === true) {

        if( res.archive == 0 ) 
        {
          this.toastr.info("User is unarchived now !","Change Status")
        } else {
          this.toastr.info("User is archived now !","Change Status")
        }
       
        this.get_users()
      }
  
  });
}
}
