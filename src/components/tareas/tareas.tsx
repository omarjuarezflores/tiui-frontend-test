import React, { useState } from 'react';
import { Button, Form, ListGroup, Modal, Navbar, Container, Nav } from 'react-bootstrap';
import { FaClipboardList } from 'react-icons/fa';

interface Tarea {
    id: number;
    nombre: string;
    dificultad: 'fácil' | 'intermedio' | 'difícil';
    estado: 'asignado' | 'en proceso' | 'finalizado';
    completada: boolean;
}

const Tareas: React.FC = () => {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [nuevaTarea, setNuevaTarea] = useState({
        nombre: '',
        dificultad: 'fácil' as 'fácil' | 'intermedio' | 'difícil',
        estado: 'asignado' as 'asignado' | 'en proceso' | 'finalizado',
    });
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editarTarea, setEditarTarea] = useState<Tarea | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tareaEditada, setTareaEditada] = useState({
        nombre: '',
        dificultad: 'fácil' as 'fácil' | 'intermedio' | 'difícil',
        estado: 'asignado' as 'asignado' | 'en proceso' | 'finalizado',
    });

    // Función para agregar una tarea
    const agregarTarea = () => {
        if (nuevaTarea.nombre.trim() !== '') {
            const nueva: Tarea = {
                id: Date.now(),
                nombre: nuevaTarea.nombre,
                dificultad: nuevaTarea.dificultad,
                estado: nuevaTarea.estado,
                completada: false,
            };
            setTareas([...tareas, nueva]);
            setNuevaTarea({
                nombre: '',
                dificultad: 'fácil',
                estado: 'asignado',
            });
            setMostrarFormulario(false);
        }
    };

    // Función para eliminar una tarea
    const eliminarTarea = (id: number) => {
        setTareas(tareas.filter(tarea => tarea.id !== id));
    };

    // Función para marcar una tarea como completada
    const marcarCompletada = (id: number) => {
        setTareas(
            tareas.map(tarea =>
                tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
            )
        );
    };

    // Función para abrir el modal de edición
    const abrirModalEdicion = (tarea: Tarea) => {
        setEditarTarea(tarea);
        setTareaEditada({
            nombre: tarea.nombre,
            dificultad: tarea.dificultad,
            estado: tarea.estado,
        });
        setMostrarModal(true);
    };

    // Función para cerrar el modal de edición
    const cerrarModalEdicion = () => {
        setMostrarModal(false);
        setEditarTarea(null);
        setTareaEditada({
            nombre: '',
            dificultad: 'fácil',
            estado: 'asignado',
        });
    };

    // Función para guardar los cambios de la tarea editada
    const guardarTareaEditada = () => {
        if (editarTarea && tareaEditada.nombre.trim() !== '') {
            setTareas(tareas.map(tarea =>
                tarea.id === editarTarea.id ? { ...tarea, ...tareaEditada } : tarea
            ));
            cerrarModalEdicion();
        }
    };

    return (
        <div>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand>Tiui Lista de Tareas</Navbar.Brand>
                    <Nav className="ml-auto">
                        <Button variant="light" onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                            {mostrarFormulario ? 'Ocultar Formulario' : 'Crear Tarea'}
                        </Button>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="mt-3">
                {mostrarFormulario && (
                    <Form>
                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre de la tarea"
                                value={nuevaTarea.nombre}
                                onChange={(e) => setNuevaTarea({ ...nuevaTarea, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDificultad">
                            <Form.Label>Dificultad</Form.Label>
                            <Form.Control
                                as="select"
                                value={nuevaTarea.dificultad}
                                onChange={(e) => setNuevaTarea({ ...nuevaTarea, dificultad: e.target.value as 'fácil' | 'intermedio' | 'difícil' })}
                            >
                                <option value="fácil">Fácil</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="difícil">Difícil</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formEstado">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                as="select"
                                value={nuevaTarea.estado}
                                onChange={(e) => setNuevaTarea({ ...nuevaTarea, estado: e.target.value as 'asignado' | 'en proceso' | 'finalizado' })}
                            >
                                <option value="asignado">Asignado</option>
                                <option value="en proceso">En Proceso</option>
                                <option value="finalizado">Finalizado</option>
                            </Form.Control>
                        </Form.Group>
                        <Button onClick={agregarTarea} className="mt-2">Agregar Tarea</Button>
                    </Form>
                )}
                <ListGroup className="mt-3">
                    {tareas.length > 0 ? (
                        tareas.map(tarea => (
                            <ListGroup.Item key={tarea.id}>
                                <div style={{ textDecoration: tarea.completada ? 'line-through' : 'none' }}>
                                    <strong>{tarea.nombre}</strong><br />
                                    Dificultad: {tarea.dificultad}<br />
                                    Estado: {tarea.estado}
                                </div>
                                <Button variant="success" onClick={() => marcarCompletada(tarea.id)} className="mx-2">Marcar como completada</Button>
                                <Button variant="warning" onClick={() => abrirModalEdicion(tarea)} className="mx-2">Editar</Button>
                                <Button variant="danger" onClick={() => eliminarTarea(tarea.id)}>Eliminar</Button>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <div className="text-center">
                            <FaClipboardList size="3em" />
                            <p className="mt-3">Aún no hay registros de tareas.</p>
                        </div>
                    )}
                </ListGroup>
            </Container>

            <Modal show={mostrarModal} onHide={cerrarModalEdicion}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Tarea</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEditarNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={tareaEditada.nombre}
                                onChange={(e) => setTareaEditada({ ...tareaEditada, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEditarDificultad">
                            <Form.Label>Dificultad</Form.Label>
                            <Form.Control
                                as="select"
                                value={tareaEditada.dificultad}
                                onChange={(e) => setTareaEditada({ ...tareaEditada, dificultad: e.target.value as 'fácil' | 'intermedio' | 'difícil' })}
                            >
                                <option value="fácil">Fácil</option>
                                <option value="intermedio">Intermedio</option>
                                <option value="difícil">Difícil</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formEditarEstado">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                as="select"
                                value={tareaEditada.estado}
                                onChange={(e) => setTareaEditada({ ...tareaEditada, estado: e.target.value as 'asignado' | 'en proceso' | 'finalizado' })}
                            >
                                <option value="asignado">Asignado</option>
                                <option value="en proceso">En Proceso</option>
                                <option value="finalizado">Finalizado</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalEdicion}>Cerrar</Button>
                    <Button variant="primary" onClick={guardarTareaEditada}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Tareas;
