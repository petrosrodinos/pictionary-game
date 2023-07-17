export interface UserLogin {
  username: string;
  password: string;
}


export interface UserRegister {
  username: string;
  password: string;
  passwordConfirmation: string;
  email: string;
  role: string;
  age: string;
}
