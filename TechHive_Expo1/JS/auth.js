/* JAVASCRIPT UNIFICADO PARA LOGIN Y REGISTRO */

document.addEventListener('DOMContentLoaded', function() {
    // DETECTAR TIPO DE PÁGINA
    const isLoginPage = document.getElementById('login-form') !== null;
    const isRegisterPage = document.getElementById('register-form') !== null;

    // ELEMENTOS COMUNES
    const listInputs = document.querySelectorAll('.form-input');
    

    // ==================== FUNCIONES UTILITARIAS ====================
    // Función para mostrar errores
    function mostrarError(claseInput, mensaje) {
        let elemento = document.querySelector(`.${claseInput}`);
        if (elemento) {
            const errorElement = elemento.querySelector('.mensaje-error');
            if (errorElement) {
                errorElement.innerHTML = mensaje;
                elemento.classList.add('invalid');
                elemento.classList.remove('valid');
            }
        }
    }

    // Función para mostrar éxito
    function mostrarExito(claseInput) {
        let elemento = document.querySelector(`.${claseInput}`);
        if (elemento) {
            const errorElement = elemento.querySelector('.mensaje-error');
            if (errorElement) {
                errorElement.innerHTML = '';
                elemento.classList.add('valid');
                elemento.classList.remove('invalid');
            }
        }
    }

    // Función para limpiar errores
    function limpiarErrores() {
        listInputs.forEach(el => {
            const errorElement = el.querySelector('.mensaje-error');
            if (errorElement) errorElement.innerHTML = '';
            el.classList.remove('valid', 'invalid');
        });
    }

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para validar mayoría de edad
    function validarMayoriaEdad(fechaNacimiento) {
        if (!fechaNacimiento) return false;
        
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();
        const mesNacimiento = fechaNac.getMonth();
        const diaNacimiento = fechaNac.getDate();
        
        // Ajustar edad si no ha cumplido años este año
        if (mesActual < mesNacimiento || (mesActual === mesNacimiento && diaActual < diaNacimiento)) {
            edad--;
        }
        
        return edad >= 18;
    }

    // Función para animar error
    function animarError(elemento) {
        elemento.classList.add('shake');
        setTimeout(() => elemento.classList.remove('shake'), 500);
    }

    // ==================== LÓGICA DEL LOGIN ====================
    
    if (isLoginPage) {
        const loginForm = document.getElementById('login-form');
        const usuario = document.getElementById('usuario');
        const password = document.getElementById('password');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            limpiarErrores();

            let valido = true;

            // Validar usuario
            if (!usuario.value.trim()) {
                mostrarError("usuario", 'Por favor ingresa el usuario');
                animarError(usuario);
                valido = false;
            } else {
                mostrarExito("usuario");
            }

            // Validar contraseña
            if (!password.value.trim()) {
                mostrarError("password", 'Por favor ingresa la contraseña');
                animarError(password);
                valido = false;
            } else {
                mostrarExito("password");
            }

            // Simular inicio de sesión
            if (valido) {
                if (usuario.value === "admin" && password.value === "1234") {
                    // Éxito - redirigir
                    window.location.href = "Index.html";
                } else {
                    mostrarError("password", 'Usuario o contraseña incorrectos');
                    animarError(password);
                }
            }
        });

        // Validación en tiempo real para login
        usuario.addEventListener('input', function() {
            if (this.value.trim()) {
                mostrarExito("usuario");
            }
        });

        password.addEventListener('input', function() {
            if (this.value.trim()) {
                mostrarExito("password");
            }
        });
    }

    // ==================== LÓGICA DEL REGISTRO ====================
    
    if (isRegisterPage) {
        const registerForm = document.getElementById('register-form');
        const usuario = document.getElementById('reg-usuario');
        const email = document.getElementById('reg-email');
        const fechaNacimiento = document.getElementById('fecha-nacimiento');
        const password = document.getElementById('reg-password');
        const confirmPassword = document.getElementById('confirm-password');

        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            limpiarErrores();

            let valido = true;

            // Validar usuario
            if (!usuario.value.trim()) {
                mostrarError("usuario", 'Por favor ingresa el usuario');
                animarError(usuario);
                valido = false;
            } else if (usuario.value.trim().length < 3) {
                mostrarError("usuario", 'El usuario debe tener al menos 3 caracteres');
                animarError(usuario);
                valido = false;
            } else {
                mostrarExito("usuario");
            }

            // Validar email
            if (!email.value.trim()) {
                mostrarError("email", 'Por favor ingresa el email');
                animarError(email);
                valido = false;
            } else if (!validarEmail(email.value)) {
                mostrarError("email", 'Por favor ingresa un email válido');
                animarError(email);
                valido = false;
            } else {
                mostrarExito("email");
            }

            // Validar fecha de nacimiento
            if (!fechaNacimiento.value.trim()) {
                mostrarError("fecha-nacimiento", 'Por favor ingresa tu fecha de nacimiento');
                animarError(fechaNacimiento);
                valido = false;
            } else if (!validarMayoriaEdad(fechaNacimiento.value)) {
                mostrarError("fecha-nacimiento", 'Debes ser mayor de 18 años para registrarte');
                animarError(fechaNacimiento);
                valido = false;
            } else {
                mostrarExito("fecha-nacimiento");
            }

            // Validar contraseña
            if (!password.value.trim()) {
                mostrarError("password", 'Por favor ingresa la contraseña');
                animarError(password);
                valido = false;
            } else if (password.value.length < 4) {
                mostrarError("password", 'La contraseña debe tener al menos 4 caracteres');
                animarError(password);
                valido = false;
            } else {
                mostrarExito("password");
            }

            // Validar confirmación de contraseña
            if (!confirmPassword.value.trim()) {
                mostrarError("confirm-password", 'Por favor confirma la contraseña');
                animarError(confirmPassword);
                valido = false;
            } else if (password.value !== confirmPassword.value) {
                mostrarError("confirm-password", 'Las contraseñas no coinciden');
                animarError(confirmPassword);
                valido = false;
            } else {
                mostrarExito("confirm-password");
            }

            // Si todo es válido, registrar usuario
            if (valido) {
                // Simular registro exitoso
                alert('¡Registro exitoso! Bienvenido a TechHive');
                window.location.href = "Index.html";
            }
        });

        // Validación en tiempo real para registro
        usuario.addEventListener('input', function() {
            if (this.value.trim().length >= 3) {
                mostrarExito("usuario");
            }
        });

        email.addEventListener('input', function() {
            if (validarEmail(this.value)) {
                mostrarExito("email");
            }
        });

        fechaNacimiento.addEventListener('input', function() {
            if (this.value && validarMayoriaEdad(this.value)) {
                mostrarExito("fecha-nacimiento");
            } else if (this.value && !validarMayoriaEdad(this.value)) {
                mostrarError("fecha-nacimiento", 'Debes ser mayor de 18 años para registrarte');
            }
        });

        password.addEventListener('input', function() {
            if (this.value.length >= 4) {
                mostrarExito("password");
                // Re-validar confirmación si existe
                if (confirmPassword.value) {
                    if (this.value === confirmPassword.value) {
                        mostrarExito("confirm-password");
                    } else {
                        mostrarError("confirm-password", 'Las contraseñas no coinciden');
                    }
                }
            }
        });

        confirmPassword.addEventListener('input', function() {
            if (this.value === password.value && this.value.length > 0) {
                mostrarExito("confirm-password");
            } else if (this.value.length > 0) {
                mostrarError("confirm-password", 'Las contraseñas no coinciden');
            }
        });
    }
});