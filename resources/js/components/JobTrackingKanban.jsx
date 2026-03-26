import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { updateJobStatus } from '../services/api';

const columns = {
    'Quotation': 'عروض الأسعار',
    'Pending Design': 'في انتظار التصميم',
    'In Production': 'قيد الإنتاج',
    'Ready': 'جاهز للتسليم',
    'Completed': 'مكتمل'
};

export default function JobTrackingKanban({ orders, onStatusChange }) {
    const [boardData, setBoardData] = useState({});

    useEffect(() => {
        const initialData = {
            'Quotation': [],
            'Pending Design': [],
            'In Production': [],
            'Ready': [],
            'Completed': []
        };

        orders.forEach(order => {
            if (initialData[order.status]) {
                initialData[order.status].push(order);
            }
        });

        setBoardData(initialData);
    }, [orders]);

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (source.droppableId === destination.droppableId) return;

        const startColumn = [...boardData[source.droppableId]];
        const finishColumn = [...boardData[destination.droppableId]];

        const [movedItem] = startColumn.splice(source.index, 1);
        movedItem.status = destination.droppableId;
        finishColumn.splice(destination.index, 0, movedItem);

        setBoardData({
            ...boardData,
            [source.droppableId]: startColumn,
            [destination.droppableId]: finishColumn
        });

        try {
            await updateJobStatus(draggableId, destination.droppableId);
            onStatusChange();
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on error
            onStatusChange();
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
            <h2 className="text-xl font-bold mb-4">لوحة تتبع المهام (Kanban)</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4" style={{ minWidth: '800px' }}>
                    {Object.keys(columns).map((statusId) => (
                        <Droppable key={statusId} droppableId={statusId}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="bg-white p-4 rounded-lg shadow w-64 min-h-[500px]"
                                >
                                    <h3 className="font-semibold text-lg border-b pb-2 mb-4 text-gray-700">{columns[statusId]}</h3>

                                    {boardData[statusId]?.map((item, index) => (
                                        <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-gray-50 border p-3 rounded mb-3 shadow-sm hover:shadow"
                                                >
                                                    <p className="font-bold text-sm">طلب #{item.id}</p>
                                                    <p className="text-xs text-gray-500">العميل: {item.customer?.name || 'غير محدد'}</p>
                                                    <p className="text-xs text-gray-500 font-semibold mt-1">الإجمالي: {item.total} ر.س</p>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
