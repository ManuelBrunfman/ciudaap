/**
 * Funciones de validación comunes para la aplicación
 */

/**
 * Valida que el formato de un correo electrónico sea correcto.
 * @param email - El correo electrónico a validar.
 * @returns true si el correo es válido, false en caso contrario.
 */
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Valida que la contraseña tenga al menos 8 caracteres,
   * contenga al menos una letra y un número.
   * @param password - La contraseña a validar.
   * @returns true si cumple con los requisitos, false en caso contrario.
   */
  export const isValidPassword = (password: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };
  
  /**
   * Verifica que una cadena de texto no esté vacía (después de eliminar espacios).
   * @param value - El valor a validar.
   * @returns true si el valor no es vacío, false en caso contrario.
   */
  export const isNotEmpty = (value: string): boolean => {
    return value.trim().length > 0;
  };
  