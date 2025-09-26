'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getPipelines, moveOpportunity } from '../../utils/api';
import { normalizePipeline, NormalizedPipeline } from '../../utils/normalize';

export function PipelineContent() {
  const [pipeline, setPipeline] = useState<NormalizedPipeline | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      const data = await getPipelines();
      if (data.length > 0) {
        const normalized = normalizePipeline(data[0]);
        setPipeline(normalized);
      }
    } catch (error) {
      console.error('Erro ao carregar pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const stageId = Number(destination.droppableId);

    try {
      await moveOpportunity(Number(draggableId), stageId);
      await loadPipeline(); // Recarrega com dados atualizados
    } catch (error) {
      console.error('Erro ao mover oportunidade:', error);
    }
  };

  if (loading) return <div className="p-4">Carregando funil...</div>;
  if (!pipeline) return <div className="p-4">Nenhum funil encontrado</div>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {pipeline.stages.map((stage) => (
          <Droppable key={stage.id} droppableId={stage.id.toString()}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 w-64 rounded-lg min-h-[500px] flex-shrink-0"
              >
                <h3 className="font-bold mb-2 text-gray-700">{stage.name}</h3>

                {stage.opportunities.map((opp, index) => (
                  <Draggable
                    key={opp.id}
                    draggableId={opp.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-3 mb-2 rounded shadow cursor-grab hover:shadow-md"
                      >
                        <h4 className="font-semibold">
                          {opp.title || opp.name}
                        </h4>
                        {opp.value && (
                          <p className="text-sm text-green-600">
                            R$ {opp.value.toLocaleString('pt-BR')}
                          </p>
                        )}
                        {opp.Contacts?.name && (
                          <p className="text-sm text-gray-600">
                            {opp.Contacts.name}
                          </p>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}

                {stage.opportunities.length === 0 && (
                  <p className="text-gray-400 text-sm italic">
                    Nenhuma oportunidade
                  </p>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
