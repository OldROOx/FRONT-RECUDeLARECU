// URL base de la API (usando ruta relativa para que funcione con proxy)
export const API_BASE_URL = '/api'

// Configuración de estados para entidades
export const ESTADOS_PEDIDO = ['pendiente', 'completado', 'cancelado']
export const ESTADOS_VENTA = ['completada', 'pendiente', 'cancelada']
export const ESTADOS_ORDEN = ['pendiente', 'recibida', 'cancelada']

// Tiempo de caché para las peticiones (en milisegundos)
export const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos