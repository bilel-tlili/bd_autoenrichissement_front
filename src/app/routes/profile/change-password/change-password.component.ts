import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'app/providers/auth.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService ,  private toastr: ToastrService ,private router: Router,) {
    this.init_form()
  }

  ngOnInit(): void {
  }

  get oldpassword() {
    return this.passwordForm.get('oldpassword');
  }
  get oldpassword2() {
    return this.passwordForm.get('oldpassword2');
  }
  get newpasword() {
    return this.passwordForm.get('newpassword');
  }

  update_password() {

    let data = { oldpassword: this.oldpassword.value, newpassword: this.newpasword.value }
    this.authService.updatePassword(data).subscribe(data => {

  

      if(data.STATUS ===1 ) {
      
      this.toastr.info('Votre mot de passe a été changé avec succés, vous etes invités à vous reonnecter','Password Update') 
      setTimeout(() => {
        this.goto(`/auth/login`);
      }, 1000);
      }
    });

  }
  private goto(url: string) {
    setTimeout(() => this.router.navigateByUrl(url));
  }

  reset() {
    this.passwordForm.reset();
  }
  init_form() {

    this.passwordForm = this.fb.group({
      oldpassword: ['', [Validators.required]],
      oldpassword2: ['', [this.confirmValidator]],
      newpassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],

    });
  }
  confirmValidator = (control: FormControl): { [k: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.passwordForm.controls.oldpassword.value) {
      return { error: true, confirm: true };
    }
    return {};
  };


}
