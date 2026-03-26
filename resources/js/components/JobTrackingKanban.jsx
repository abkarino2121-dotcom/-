import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { updateJobStatus } from '../services/api';
import { Clock, LayoutTemplate, Settings, Truck, CheckCircle, GripVertical } from 'lucide-react';

const statuses = [
    { id: 'Quotation', name: 'عروض الأسعار', icon: LayoutTemplate, color: 'border-slate-300 text-slate-700 bg-slate-50' },
    { id: 'Pending Design', name: 'في انتظار التصميم', icon: Clock, color: 'border-blue-300 text-blue-700 bg-blue-50' },
    { id: 'In Production', name: 'قيد الإنتاج', icon: Settings, color: 'border-amber-300 text-amber-700 bg-amber-50' },
    { id: 'Ready', name: 'جاهز للتسليم', icon: Truck, color: 'border-indigo-300 text-indigo-700 bg-indigo-50' },
    { id: 'Completed', name: 'مكتمل', icon: CheckCircle, color: 'border-emerald-300 text-emerald-700 bg-emerald-50' }
];

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
        <div className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto font-['Tajawal'] border border-slate-100 min-h-[70vh]">
            <div className="mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <LayoutTemplate className="w-6 h-6 mr-3 ml-2 text-blue-600" />
                    لوحة المهام والإنتاج
                </h2>
                <p className="text-gray-500 text-sm mt-1">قم بسحب وإفلات المهام لتحديث حالتها (تحديث تلقائي للمخزون)</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-4 pb-4" style={{ minWidth: '1200px' }}>
                    {statuses.map((status) => (
                        <Droppable key={status.id} droppableId={status.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`w-72 flex-shrink-0 flex flex-col rounded-2xl overflow-hidden shadow-sm transition-colors border ${snapshot.isDraggingOver ? 'bg-slate-100 border-dashed border-2 border-slate-400' : 'bg-slate-50 border-slate-200'}`}
                                >
                                    <div className={`p-4 border-b flex items-center justify-between font-bold ${status.color}`}>
                                        <div className="flex items-center">
                                            <status.icon className="w-5 h-5 ml-2 opacity-80" />
                                            {status.name}
                                        </div>
                                        <span className="bg-white/50 text-xs px-2 py-1 rounded-full">{boardData[status.id]?.length || 0}</span>
                                    </div>

                                    <div className="flex-1 p-3 overflow-y-auto min-h-[500px] space-y-3">
                                        {boardData[status.id]?.map((item, index) => (
                                            <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-white border rounded-xl p-4 shadow-sm group hover:shadow-md transition-all relative ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-lg z-50 ring-2 ring-blue-400' : 'border-slate-200'}`}
                                                    >
                                                        <div className="absolute top-4 left-3 text-slate-300 group-hover:text-slate-500 cursor-grab">
                                                            <GripVertical className="w-4 h-4" />
                                                        </div>

                                                        <div className="flex justify-between items-start mb-3">
                                                            <span className="bg-slate-100 text-slate-600 font-mono text-xs px-2 py-1 rounded-md font-bold">
                                                                #{item.id.toString().padStart(4, '0')}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {new Date(item.created_at).toLocaleDateString('ar-SA')}
                                                            </span>
                                                        </div>

                                                        <h4 className="font-bold text-slate-800 text-sm mb-1 truncate">
                                                            العميل: {item.customer?.name || 'غير محدد'}
                                                        </h4>

                                                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                                            <span className="text-xs text-slate-500">الإجمالي</span>
                                                            <span className="font-bold text-sm text-blue-600">{parseFloat(item.total).toFixed(2)} <span className="text-[10px] text-slate-400">ر.س</span></span>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
