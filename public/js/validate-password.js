function ValidatePassword() {
    let password = document.getElementById('password').value
    let passwordConfirm = document.getElementById('password-confirm').value

    if(password !== passwordConfirm) {
    alert('password do not match')
    }


}