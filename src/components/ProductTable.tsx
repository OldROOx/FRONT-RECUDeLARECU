import { Product } from '../types'

interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
}

// Componente que muestra la tabla de productos
function ProductTable({ products, onEdit, onDelete, disabled }: ProductTableProps) {
    if (!products.length) {
        return <p>No hay productos disponibles.</p>
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="py-2 px-4 border-b">ID</th>
                    <th className="py-2 px-4 border-b">Nombre</th>
                    <th className="py-2 px-4 border-b">Descripción</th>
                    <th className="py-2 px-4 border-b">Precio</th>
                    <th className="py-2 px-4 border-b">Existencia</th>
                    <th className="py-2 px-4 border-b">Proveedor</th>
                    <th className="py-2 px-4 border-b">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id_producto} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{product.id_producto}</td>
                        <td className="py-2 px-4 border-b">{product.nombre}</td>
                        <td className="py-2 px-4 border-b">{product.descripcion}</td>
                        <td className="py-2 px-4 border-b">${product.precio.toLocaleString()}</td>
                        <td className="py-2 px-4 border-b">{product.existencia}</td>
                        <td className="py-2 px-4 border-b">{product.id_proveedor}</td>
                        <td className="py-2 px-4 border-b">
                            <button
                                onClick={() => onEdit(product)}
                                disabled={disabled}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2 disabled:opacity-50"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onDelete(product.id_producto)}
                                disabled={disabled}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductTable