// Tipo genérico para representar cualquier entidad
export interface Entity {
    [key: string]: any;
}

// Tipo para datos de formulario
export interface FormData {
    [key: string]: any;
}

// Definición de un campo de formulario
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'email' | 'select' | 'date';
    required?: boolean;
    min?: number;
    max?: number;
    options?: Array<{value: string | number, label: string}>;
}

// Interfaces específicas para cada entidad
export interface Product {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    existencia: number;
    id_proveedor: number;
    fecha_creacion?: string;
}

export interface Proveedor {
    id_proveedor: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    fecha_registro?: string;
}

export interface Pedido {
    id_pedido: number;
    fecha_pedido?: string;
    estado: string;
    total: number;
}

export interface Venta {
    id_venta: number;
    fecha_venta?: string;
    estado: string;
    total: number;
}

export interface OrdenProveedor {
    id_orden_proveedor: number;
    id_proveedor: number;
    fecha_orden?: string;
    estado: string;
    total: number;
}