import { Entity } from '../types'
import { cancelPedido, cancelVenta, cancelOrden, recibirOrden } from '../services/api'

interface EntityTableProps {
    entities: Entity[];
    idField: string;
    onEdit: (entity: Entity) => void;
    onDelete: (id: number) => void;
    disabled: boolean;
    entityType?: string;
    onRefresh?: () => void;
}

// Componente que muestra una tabla genérica de entidades
function EntityTable({
                         entities,
                         idField,
                         onEdit,
                         onDelete,
                         disabled,
                         entityType = '',
                         onRefresh
                     }: EntityTableProps) {
    if (!entities.length) {
        return <p>No hay datos disponibles.</p>
    }

    // Obtener encabezados de la tabla a partir de la primera entidad
    const headers = Object.keys(entities[0]).filter(key =>
        // Filtrar campos que no queremos mostrar
        key !== 'fecha_creacion' &&
        key !== 'fecha_registro' &&
        !key.startsWith('__')
    )

    // Formatear el valor para mostrarlo en la tabla
    const formatValue = (value: any): string => {
        if (value === null || value === undefined) return '-'
        if (typeof value === 'boolean') return value ? 'Sí' : 'No'
        if (typeof value === 'object' && value instanceof Date) return value.toLocaleDateString()
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value)
    }

    // Manejar la cancelación de pedidos, ventas o órdenes
    const handleCancelar = async (id: number) => {
        if (!window.confirm(`¿Está seguro de cancelar este ${entityType.slice(0, -1)}?`)) return

        try {
            let result;
            switch (entityType) {
                case 'pedidos':
                    result = await cancelPedido(id);
                    break;
                case 'ventas':
                    result = await cancelVenta(id);
                    break;
                case 'ordenes':
                    result = await cancelOrden(id);
                    break;
                default:
                    throw new Error(`No se puede cancelar tipo: ${entityType}`);
            }

            alert(`${entityType.slice(0, -1)} cancelado correctamente`);
            if (onRefresh) onRefresh();
        } catch (error) {
            alert(`Error al cancelar: ${(error as Error).message}`);
            console.error('Error al cancelar:', error);
        }
    }

    // Manejar la recepción de órdenes
    const handleRecibir = async (id: number) => {
        if (!window.confirm(`¿Está seguro de marcar como recibida esta orden?`)) return

        try {
            await recibirOrden(id);
            alert('Orden recibida correctamente');
            if (onRefresh) onRefresh();
        } catch (error) {
            alert(`Error al recibir orden: ${(error as Error).message}`);
            console.error('Error al recibir orden:', error);
        }
    }

    return (
        <div className="overflow-x-auto">
            <table>
                <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header}>
                            {header.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                        </th>
                    ))}
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {entities.map(entity => (
                    <tr key={entity[idField]}>
                        {headers.map(header => (
                            <td key={header}>
                                {header.includes('precio') || header.includes('total')
                                    ? `$${formatValue(entity[header])}`
                                    : formatValue(entity[header])}
                            </td>
                        ))}
                        <td>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onEdit(entity)}
                                    disabled={disabled}
                                    className="btn-primary"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => onDelete(entity[idField])}
                                    disabled={disabled}
                                    className="btn-danger"
                                >
                                    Eliminar
                                </button>

                                {/* Botones específicos para pedidos, ventas y órdenes */}
                                {(entityType === 'pedidos' || entityType === 'ventas' || entityType === 'ordenes') &&
                                    entity.estado !== 'cancelado' && entity.estado !== 'cancelada' && (
                                        <button
                                            onClick={() => handleCancelar(entity[idField])}
                                            disabled={disabled}
                                            className="btn-warning"
                                        >
                                            Cancelar
                                        </button>
                                    )}

                                {/* Botón específico para órdenes */}
                                {entityType === 'ordenes' && entity.estado === 'pendiente' && (
                                    <button
                                        onClick={() => handleRecibir(entity[idField])}
                                        disabled={disabled}
                                        className="btn-success"
                                    >
                                        Recibir
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default EntityTable