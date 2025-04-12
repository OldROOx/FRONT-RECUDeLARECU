import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Product } from '../types'

interface ProductFormData {
    nombre: string;
    descripcion: string;
    precio: number | string;
    existencia: number | string;
    id_proveedor: number | string;
}

interface ProductFormProps {
    onSave: (productData: Omit<Product, 'id_producto'>) => void;
    product: Product | null;
    onCancel: () => void;
    disabled: boolean;
}

// Formulario para crear o editar productos
function ProductForm({ onSave, product, onCancel, disabled }: ProductFormProps) {
    // Estado inicial del formulario
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '',
        descripcion: '',
        precio: '',
        existencia: '',
        id_proveedor: ''
    })

    // Si se está editando un producto, cargar sus datos
    useEffect(() => {
        if (product) {
            setFormData({
                nombre: product.nombre || '',
                descripcion: product.descripcion || '',
                precio: product.precio || '',
                existencia: product.existencia || '',
                id_proveedor: product.id_proveedor || ''
            })
        } else {
            // Reset form when not editing
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                existencia: '',
                id_proveedor: ''
            })
        }
    }, [product])

    // Manejar cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: name === 'precio' || name === 'existencia' || name === 'id_proveedor'
                ? parseInt(value) || ''
                : value
        })
    }

    // Enviar el formulario
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validación básica
        if (!formData.nombre || !formData.precio || Number(formData.precio) <= 0) {
            alert('Por favor complete todos los campos requeridos')
            return
        }

        // Preparar datos para enviar
        const productData = {
            ...formData,
            precio: parseInt(String(formData.precio)),
            existencia: parseInt(String(formData.existencia)) || 0,
            id_proveedor: parseInt(String(formData.id_proveedor)) || 1
        }

        onSave(productData)

        // Si no estamos editando, limpiar el formulario
        if (!product) {
            setFormData({
                nombre: '',
                descripcion: '',
                precio: '',
                existencia: '',
                id_proveedor: ''
            })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 border rounded shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre*
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio*
                    </label>
                    <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Existencia
                    </label>
                    <input
                        type="number"
                        name="existencia"
                        value={formData.existencia}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID Proveedor
                    </label>
                    <input
                        type="number"
                        name="id_proveedor"
                        value={formData.id_proveedor}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        disabled={disabled}
                        className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4 space-x-3">
                {product && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={disabled}
                        className="py-2 px-4 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={disabled}
                    className="py-2 px-4 bg-blue-600 border border-transparent rounded text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {product ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default ProductForm