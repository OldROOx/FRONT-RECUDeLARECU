import { useState, useEffect } from 'react'
import EntityTable from './components/EntityTable'
import EntityForm from './components/EntityForm'
import { getAll, create, update, remove } from './services/api'
import { Entity, FormData, FormField } from './types'

function App() {
    const [entities, setEntities] = useState<Entity[]>([])
    const [currentEntity, setCurrentEntity] = useState<string>('productos')
    const [editing, setEditing] = useState<Entity | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    // Cargar entidades al iniciar o cambiar de tipo
    useEffect(() => {
        fetchEntities()
    }, [currentEntity])

    // Obtener todas las entidades del tipo actual
    const fetchEntities = async () => {
        setLoading(true)
        setError('')
        try {
            const data = await getAll(currentEntity)
            setEntities(data)
        } catch (err) {
            setError('Error al cargar datos: ' + (err as Error).message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Guardar una entidad (nueva o editada)
    const handleSave = async (formData: FormData) => {
        setLoading(true)
        setError('')
        try {
            if (editing) {
                // Actualizar entidad existente
                const idField = getIdField(currentEntity)
                const id = editing[idField]
                const updated = await update(currentEntity, id, formData)
                setEntities(entities.map(e =>
                    e[idField] === id ? updated : e
                ))
                setEditing(null)
            } else {
                // Crear nueva entidad
                const newEntity = await create(currentEntity, formData)
                setEntities([...entities, newEntity])
            }
        } catch (err) {
            setError('Error al guardar: ' + (err as Error).message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Editar una entidad
    const handleEdit = (entity: Entity) => {
        setEditing(entity)
    }

    // Eliminar una entidad
    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Está seguro de eliminar este elemento?')) return

        setLoading(true)
        setError('')
        try {
            await remove(currentEntity, id)
            const idField = getIdField(currentEntity)
            setEntities(entities.filter(e => e[idField] !== id))
        } catch (err) {
            setError('Error al eliminar: ' + (err as Error).message)
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Cambiar el tipo de entidad actual
    const changeEntityType = (entityType: string) => {
        setCurrentEntity(entityType)
        setEditing(null)
    }

    // Obtener el nombre del campo ID según el tipo de entidad
    const getIdField = (entityType: string): string => {
        switch(entityType) {
            case 'productos': return 'id_producto'
            case 'proveedores': return 'id_proveedor'
            case 'pedidos': return 'id_pedido'
            case 'ventas': return 'id_venta'
            case 'ordenes': return 'id_orden_proveedor'
            default: return 'id'
        }
    }

    // Configurar los campos del formulario según el tipo de entidad
    const getFormFields = (): FormField[] => {
        switch(currentEntity) {
            case 'productos':
                return [
                    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                    { name: 'descripcion', label: 'Descripción', type: 'textarea' },
                    { name: 'precio', label: 'Precio', type: 'number', required: true },
                    { name: 'existencia', label: 'Existencia', type: 'number' },
                    { name: 'id_proveedor', label: 'ID Proveedor', type: 'number' }
                ]
            case 'proveedores':
                return [
                    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                    { name: 'direccion', label: 'Dirección', type: 'text' },
                    { name: 'telefono', label: 'Teléfono', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' }
                ]
            case 'pedidos':
                return [
                    { name: 'estado', label: 'Estado', type: 'select', required: true,
                        options: [
                            { value: 'pendiente', label: 'Pendiente' },
                            { value: 'completado', label: 'Completado' },
                            { value: 'cancelado', label: 'Cancelado' }
                        ]
                    },
                    { name: 'total', label: 'Total', type: 'number', required: true }
                ]
            case 'ventas':
                return [
                    { name: 'estado', label: 'Estado', type: 'select', required: true,
                        options: [
                            { value: 'completada', label: 'Completada' },
                            { value: 'pendiente', label: 'Pendiente' },
                            { value: 'cancelada', label: 'Cancelada' }
                        ]
                    },
                    { name: 'total', label: 'Total', type: 'number', required: true }
                ]
            case 'ordenes':
                return [
                    { name: 'id_proveedor', label: 'ID Proveedor', type: 'number', required: true },
                    { name: 'estado', label: 'Estado', type: 'select', required: true,
                        options: [
                            { value: 'pendiente', label: 'Pendiente' },
                            { value: 'recibida', label: 'Recibida' },
                            { value: 'cancelada', label: 'Cancelada' }
                        ]
                    },
                    { name: 'total', label: 'Total', type: 'number', required: true }
                ]
            default:
                return []
        }
    }

    return (
        <div className="container">
            <h1>Sistema de Gestión</h1>

            {/* Selector de entidad */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {['productos', 'proveedores', 'pedidos', 'ventas', 'ordenes'].map(entity => (
                        <button
                            key={entity}
                            onClick={() => changeEntityType(entity)}
                            className={currentEntity === entity ? 'btn-primary' : 'btn-secondary'}
                        >
                            {entity.charAt(0).toUpperCase() + entity.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="mb-8">
                <h2>
                    {editing ? `Editar ${currentEntity.slice(0, -1)}` : `Nuevo ${currentEntity.slice(0, -1)}`}
                </h2>
                <EntityForm
                    onSave={handleSave}
                    entity={editing}
                    fields={getFormFields()}
                    onCancel={() => setEditing(null)}
                    disabled={loading}
                />
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <h2>Lista de {currentEntity}</h2>
                    <button onClick={fetchEntities} className="btn-secondary">
                        Refrescar
                    </button>
                </div>

                {loading && !entities.length ? (
                    <p>Cargando datos...</p>
                ) : (
                    <EntityTable
                        entities={entities}
                        idField={getIdField(currentEntity)}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        disabled={loading}
                        entityType={currentEntity}
                        onRefresh={fetchEntities}
                    />
                )}
            </div>
        </div>
    )
}

export default App