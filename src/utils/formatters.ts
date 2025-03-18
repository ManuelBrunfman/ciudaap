/**
 * Funciones de formateo para mostrar datos de forma legible en la aplicación
 */

/**
 * Formatea un número como moneda.
 * @param amount - La cantidad numérica.
 * @param locale - La configuración regional (por defecto 'es-ES').
 * @param currency - La moneda (por defecto 'EUR').
 * @returns La cantidad formateada como moneda.
 */
export const formatCurrency = (
    amount: number,
    locale: string = 'es-ES',
    currency: string = 'EUR'
  ): string => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  };
  
  /**
   * Formatea una fecha en función de la configuración regional y opciones dadas.
   * @param date - La fecha (como objeto Date o string).
   * @param locale - La configuración regional (por defecto 'es-ES').
   * @param options - Opciones de formateo (por defecto: día numérico, mes largo y año numérico).
   * @returns La fecha formateada como cadena.
   */
  export const formatDate = (
    date: Date | string,
    locale: string = 'es-ES',
    options?: Intl.DateTimeFormatOptions
  ): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formatOptions: Intl.DateTimeFormatOptions = options || {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
  };
  
  /**
   * Formatea un número como porcentaje.
   * @param value - El número a formatear.
   * @param locale - La configuración regional (por defecto 'es-ES').
   * @returns El número formateado como porcentaje.
   */
  export const formatPercentage = (value: number, locale: string = 'es-ES'): string => {
    return new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: 2 }).format(value);
  };
  