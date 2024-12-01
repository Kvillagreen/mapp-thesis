import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/rest-api/auth.service';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import emailjs from 'emailjs-com';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  fname: string = '';
  lname: string = '';
  businessName: string = '';
  contactNumber: string = '';
  username: string = '';
  confirmPassword: string = '';
  successMessage = '';
  errorMessage: string = '';
  tokenId: string = '';
  currentTime: string = '';
  constructor(private authService: AuthService, private router: Router) { }
  templateParams = {
    // Assuming you have form values like these
    from_name: 'John Doe',  // Replace with dynamic data, e.g., form.value.name
    from_email: 'john.doe@example.com',  // Replace with form.value.email
    message: 'User has signed up and is now trying to log in.',  // Example message
  };
  goToSignIn() {
    this.router.navigate(['/login']);
  }
  private emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private passwordPatterm: RegExp = /^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/
  private phoneNumberPattern: RegExp = /^(?:639\d{9}|09\d{9})$/;
  generateUUID() {
    const uniqueId = uuidv4();
    this.tokenId = uniqueId;
  }

  onSignUp() {
    // Validate if password and confirm password match
    if (this.email == '' || this.password == '' || this.fname == '' || this.lname == '' || this.businessName == '' || this.contactNumber == '' || this.username == '' || this.confirmPassword == '') {
      this.errorMessage = 'All fields are required!';
      return;
    }
    if (
      (this.contactNumber.startsWith("639") && this.contactNumber.length !== 12) ||
      (this.contactNumber.startsWith("09") && this.contactNumber.length !== 11) ||
      !this.phoneNumberPattern.test(this.contactNumber)) {
      this.errorMessage = 'Invalid phone number';
      console.log(this.errorMessage);
      return;
    }
    if (this.password.length < 6) {
      this.errorMessage = 'Passwords must be 6 characters long!';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }
    if (!this.passwordPatterm.test(this.password)) {
      this.errorMessage = 'Include atleast one symbos and number!';
      return;
    }
    if (!this.emailPattern.test(this.email)) {
      this.errorMessage = 'Invalid Email Format!';
      return;
    }

    else {
      this.generateUUID();
      this.authService.register(this.email, this.password, this.username, this.fname, this.lname, this.businessName, this.contactNumber, this.tokenId).subscribe({
        next: (response) => {
          if (response.success) {

            const now = new Date(); // Get current date and time
            this.currentTime = now.toLocaleString();
            emailjs.send("service_l1qrwc6", "template_spu6fzu", {
              from_name: this.fname + this.lname,
              from_email: this.email,
              creation_date: this.currentTime,
            }, 'Tv0xOXxLvWH60MEV_').then((result) => {
              console.log('Email sent successfully!', result.text);
            })
              .catch((error) => {
                console.error('Email sending failed:', error);
              });
            console.log('Registration request success');
            this.errorMessage = '';
            this.successMessage = 'Registration success!';
            this.email = '';
            this.password = '';
            this.fname = '';
            this.lname = '';
            this.businessName = '';
            this.contactNumber = '';
            this.username = '';
            this.confirmPassword = '';
          } else {
            this.errorMessage = response.message;
            console.log(this.errorMessage);
          }
        },
        error: (error) => {
          this.errorMessage = 'There was an error with the registration request.';
          console.log(error);
        },
        complete: () => {
          console.log('Registration request completed');
        }
      });

    }


  }
}
