import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate()
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalsave, setShowModalsave] = useState(false);
    const [crrevent, setCrrevent] = useState({})
    const [newEvent, setNewEvent] = useState({
        name: '',
        description: '',
        date: '',
        category: '',
    });
    const [filters, setFilters] = useState({
        category: '',
        startDate: '',
        endDate: '',
        search: '',
    });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get("http://localhost:5000/api/events", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: filters,
                });
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();

        // Connect to Socket.IO server
        const socket = io('http://localhost:5000');

        // Listen for new events
        socket.on('newEvent', (newEvent) => {
            // setEvents((prevEvents) => [...prevEvents, newEvent]);
        });

        return () => {
            socket.disconnect();
        };
    }, [filters]);
    

    const handleUpdate = async (crrevent) => {
        const token = localStorage.getItem('token');

        const data = await axios.put(`http://localhost:5000/api/events/${crrevent._id}`,
            newEvent,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(response => {
                alert(`${response.data.message} please refresh the page`);  // This will log: "Event with id {id} deleted successfully."
            })

        setCrrevent({})
        setShowModalsave(false)
    }

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        const data = await axios.delete(`http://localhost:5000/api/events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(response => {
            alert(`${response.data.message} please refresh the page`);  // This will log: "Event with id {id} deleted successfully."
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateEvent = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(
                "http://localhost:5000/api/events",
                newEvent,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEvents((prev) => [...prev, data]); // Add new event to the list
            setShowModal(false); // Close the modal
            setNewEvent({ name: '', description: '', date: '', category: '' }); // Reset form
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Error creating event');
        }
    };

    return (
        <div className="min-h-screen bg-background text-textPrimary">
            <header className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Event Dashboard</h1>
                <div className="mt-4">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by name or description"
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="p-2 mb-4 bg-background border border-gray-700 rounded"
                    />
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="p-2 mb-4 bg-background border border-gray-700 rounded"
                    >
                        <option value="">All Categories</option>
                        <option value="Music">Music</option>
                        <option value="Sports">Sports</option>
                        <option value="Tech">Tech</option>
                        <option value="Arts">Arts</option>
                    </select>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="p-2 mb-4 bg-background border border-gray-700 rounded"
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="p-2 mb-4 bg-background border border-gray-700 rounded"
                    />
                </div>
                <button
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    onClick={() => setShowModal(true)}
                >
                    Create Event
                </button>
            </header>
            <main className="p-6">
                {events.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <li
                                key={event._id}
                                className="bg-card p-4 rounded-lg shadow hover:shadow-lg transition"
                            >
                                <div className='flex justify-between'>
                                    <h3 className="text-lg font-semibold">{event.name}</h3>
                                    <div className="icon flex gap-3">
                                        <span onClick={() => {
                                            setShowModalsave(true); setCrrevent(event); setNewEvent({
                                                name: event.name,
                                                description: event.description,
                                                date: event.date,
                                                category: event.category
                                            })
                                        }} className='hover:cursor-pointer'><img src="/edit.svg" alt="Delete" width={"30px"} height={"30px"} /></span>
                                        <span onClick={() => { handleDelete(event._id) }} className='hover:cursor-pointer'><img src="/delete.svg" alt="Delete" width={"35px"} height={"35px"} /></span>
                                    </div>
                                </div>
                                <p className="text-textSecondary">{event.description}</p>
                                <small className="block mt-2 text-sm text-textSecondary">
                                    {new Date(event.date).toLocaleString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-textSecondary">No events available</p>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-card p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Create New Event</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCreateEvent();
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Event Name"
                                value={newEvent.name}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, name: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newEvent.description}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, description: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <input
                                type="datetime-local"
                                value={newEvent.date}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, date: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newEvent.category}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, category: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showModalsave && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-card p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Update Event</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleUpdate(crrevent)
                            }}
                        >
                            <input
                                type="text"
                                placeholder="Event Name"
                                value={newEvent.name}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, name: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <textarea
                                placeholder="Description"
                                value={newEvent.description}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, description: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <input
                                type="datetime-local"
                                value={newEvent.date}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, date: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newEvent.category}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, category: e.target.value })
                                }
                                className="w-full p-2 mb-4 bg-background border border-gray-700 rounded"
                                required
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                                    onClick={() => setShowModalsave(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Dashboard;
