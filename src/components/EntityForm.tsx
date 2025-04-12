import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Entity, FormData, FormField } from '../types'

interface EntityFormProps {
    onSave: (formData: FormData) => void;
    entity: Entity | null;
    fields: FormField[];
    onCancel: () => void;
    disabled: boolean;
}

// Formulario genérico para crear o editar entidades
function EntityForm({ onSave, entity, fields, onCancel, disabled }: EntityFormProps) {
    // Estado inicial del formulario
    const [formData, setFormData] = useState<FormData>({})

    // Si se está editando una entidad, cargar sus datos
    useEffect(() => {
        if (entity) {
            const initialData: FormData = {}
            fields.forEach(field => {
                initialData[field.name] = entity[field.name] ?? ''
            })
            setFormData(initialData)
        } else {
            // Reset form when not editing
            const initialData: FormData = {}
            fields.forEach(field => {
                initialData[field.name] = ''
            })
            setFormData(initialData)
        }
    }, [entity, fields])

    // Manejar cambios en los inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        // Convertir números si el tipo es numérico
        const processedValue = type === 'number' ? (value ? parseFloat(value) : '') : value

        setFormData({
            ...formData,
            [name]: processedValue,
        })
    }

    // Enviar el formulario
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Validación básica
        let isValid = true
        const requiredFields = fields.filter(field => field.required)

        for (const field of requiredFields) {
            if (!formData[field.name]) {
                isValid = false
                alert(`El campo ${field.label} es obligatorio`)
                return
            }
        }

        if (!isValid) return

        // Preparar datos para enviar
        const entityData: FormData = { ...formData }

        // Convertir tipos según corresponda
        fields.forEach(field => {
            if (field.type === 'number' && entityData[field.name]) {
                entityData[field.name] = Number(entityData[field.name])
            }
        })

        onSave(entityData)

        // Si no estamos editando, limpiar el formulario
        if (!entity) {
            const resetData: FormData = {}
            fields.forEach(field => {
                resetData[field.name] = ''
            })
            setFormData(resetData)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow mb-4">
            <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
                {fields.map(field => (
                    <div key={field.name} className={field.type === 'textarea' ? 'grid-cols-2' : ''}>
                        <label>
                            {field.label}{field.required ? '*' : ''}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={disabled}
                                rows={3}
                                required={field.required}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={disabled}
                                required={field.required}
                            >
                                <option value="">Seleccione...</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleChange}
                                disabled={disabled}
                                min={field.type === 'number' ? (field.min ?? 0) : undefined}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end mt-4 space-x-3">
                {entity && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={disabled}
                        className="btn-secondary"
                    >
                        Cancelar
                    </button>
                )}

                <button
                    type="submit"
                    disabled={disabled}
                    className="btn-primary"
                >
                    {entity ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}

export default EntityForm