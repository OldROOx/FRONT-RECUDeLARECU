import { API_BASE_URL } from '../config'
import { Entity, FormData } from '../types'

// Función auxiliar para manejar errores en las respuestas
const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        let errorMessage;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
            errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
    }
    return response.json() as Promise<T>;
}

// Obtener todas las entidades de un tipo
export const getAll = async (entityType: string): Promise<Entity[]> => {
    const response = await fetch(`${API_BASE_URL}/${entityType}`, {
        headers: {
            'Accept': 'application/json',
        }
    });
    return handleResponse<Entity[]>(response);
}

// Obtener una entidad por ID
export const getById = async (entityType: string, id: number): Promise<Entity> => {
    const response = await fetch(`${API_BASE_URL}/${entityType}/${id}`, {
        headers: {
            'Accept': 'application/json',
        }
    });
    return handleResponse<Entity>(response);
}

// Crear una nueva entidad
export const create = async (entityType: string, data: FormData): Promise<Entity> => {
    // Convertir cualquier número como string a número real
    Object.keys(data).forEach(key => {
        const value = data[key];
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
            data[key] = Number(value);
        }
    });

    const response = await fetch(`${API_BASE_URL}/${entityType}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse<Entity>(response);
}

// Actualizar una entidad existente
export const update = async (entityType: string, id: number, data: FormData): Promise<Entity> => {
    // Convertir cualquier número como string a número real
    Object.keys(data).forEach(key => {
        const value = data[key];
        if (typeof value === 'string' && !isNaN(Number(value)) && value !== '') {
            data[key] = Number(value);
        }
    });

    console.log(`Actualizando ${entityType}/${id} con:`, data);

    const response = await fetch(`${API_BASE_URL}/${entityType}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error('Error al actualizar:', response.status, response.statusText);
        try {
            const errorText = await response.text();
            console.error('Detalle del error:', errorText);
        } catch (e) {
            console.error('No se pudo leer el error');
        }
    }

    return handleResponse<Entity>(response);
}

// Operación PATCH (actualizar parcialmente una entidad)
export const patch = async (entityType: string, id: number, data: Record<string, unknown>): Promise<Entity> => {
    const response = await fetch(`${API_BASE_URL}/${entityType}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse<Entity>(response);
}

// Eliminar una entidad
export const remove = async (entityType: string, id: number): Promise<Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/${entityType}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        }
    });
    return handleResponse<Record<string, unknown>>(response);
}

// Operaciones específicas para productos
export const updateProductStock = async (id: number, stockAmount: number): Promise<Record<string, unknown>> => {
    return patch('productos', id, { stock: stockAmount });
}

// Operaciones específicas para pedidos
export const cancelPedido = async (id: number): Promise<Record<string, unknown>> => {
    console.log(`Cancelando pedido ${id}`);
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}/cancelar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        console.error('Error al cancelar pedido:', response.status, response.statusText);
        try {
            const errorText = await response.text();
            console.error('Detalle del error:', errorText);
        } catch (e) {
            console.error('No se pudo leer el error');
        }
    }

    return handleResponse<Record<string, unknown>>(response);
}

// Operaciones específicas para ventas
export const cancelVenta = async (id: number): Promise<Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/ventas/${id}/cancelar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    return handleResponse<Record<string, unknown>>(response);
}

// Operaciones específicas para órdenes de proveedor
export const cancelOrden = async (id: number): Promise<Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/ordenes/${id}/cancelar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    return handleResponse<Record<string, unknown>>(response);
}

export const recibirOrden = async (id: number): Promise<Record<string, unknown>> => {
    const response = await fetch(`${API_BASE_URL}/ordenes/${id}/recibir`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    return handleResponse<Record<string, unknown>>(response);
}