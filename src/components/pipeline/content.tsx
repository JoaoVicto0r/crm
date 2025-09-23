// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from '../../components/ui/card';
// import { getPipelines } from '../../utils/api';

// // Tipos básicos
// interface Stage {
//   id: number;
//   name: string;
//   opportunities: { id: number; title: string }[];
// }

// interface Pipeline {
//   id: number;
//   name: string;
//   stages: Stage[];
// }

// export function PipelineContent() {
//   const [pipelines, setPipelines] = useState<Pipeline[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getPipelines()
//       .then(setPipelines)
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <p className="text-white">Carregando pipeline...</p>;

//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-bold text-white">Gestão de Funil</h1>
//       {pipelines.map((pipeline) => (
//         <Card key={pipeline.id} className="bg-gray-900 border-gray-800">
//           <CardHeader>
//             <CardTitle className="text-white">{pipeline.name}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex gap-4 overflow-x-auto">
//               {pipeline.stages.map((stage) => (
//                 <div
//                   key={stage.id}
//                   className="flex-1 min-w-[200px] bg-gray-800 p-3 rounded"
//                 >
//                   <h2 className="font-semibold text-white mb-2">
//                     {stage.name}
//                   </h2>
//                   <div className="space-y-2">
//                     {stage.opportunities.map((opp) => (
//                       <div
//                         key={opp.id}
//                         className="bg-white text-black p-2 rounded shadow"
//                       >
//                         {opp.title}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { getPipelines, moveOpportunity, Pipeline } from '../../utils/api';

// export function PipelineContent() {
//   const [pipeline, setPipeline] = useState<Pipeline | null>(null);

//   useEffect(() => {
//     getPipelines().then((data) => {
//       setPipeline(data[0]); // pega o primeiro pipeline (ou faça um seletor depois)
//     });
//   }, []);

//   const handleDragEnd = async (result: any) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     const stageId = Number(destination.droppableId);

//     // Atualiza no backend
//     await moveOpportunity(Number(draggableId), stageId);

//     // Atualiza no frontend (básico: recarrega)
//     const data = await getPipelines();
//     setPipeline(data[0]);
//   };

//   if (!pipeline) return <p>Carregando pipeline...</p>;

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="flex gap-4">
//         {pipeline.stages.map((stage) => (
//           <Droppable key={stage.id} droppableId={stage.id.toString()}>
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="bg-gray-100 p-4 w-64 rounded-lg"
//               >
//                 <h3 className="font-bold mb-2">{stage.name}</h3>
//                 {stage.opportunities.map((opp, index) => (
//                   <Draggable
//                     key={opp.id}
//                     draggableId={opp.id.toString()}
//                     index={index}
//                   >
//                     {(prov) => (
//                       <div
//                         ref={prov.innerRef}
//                         {...prov.draggableProps}
//                         {...prov.dragHandleProps}
//                         className="bg-white p-3 mb-2 rounded shadow"
//                       >
//                         {opp.title}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </DragDropContext>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import { getPipelines, moveOpportunity, Pipeline } from '../../utils/api';

// export function PipelineContent() {
//   const [pipeline, setPipeline] = useState<Pipeline | null>(null);

//   useEffect(() => {
//     getPipelines().then((data) => {
//       setPipeline(data[0]); // pega o primeiro pipeline
//     });
//   }, []);

//   const handleDragEnd = async (result: any) => {
//     if (!result.destination) return;

//     const { draggableId, destination } = result;
//     const stageId = Number(destination.droppableId);

//     // Atualiza no backend
//     await moveOpportunity(Number(draggableId), stageId);

//     // Recarrega pipeline
//     const data = await getPipelines();
//     setPipeline(data[0]);
//   };

//   if (!pipeline) return <p>Carregando pipeline...</p>;

//   // fallback: aceita tanto stages/opportunities quanto Stages/Opportunitys
//   const stages = (pipeline.stages || (pipeline as any).Stages || []) as any[];

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="flex gap-4">
//         {stages.map((stage) => {
//           const opportunities = stage.opportunities || stage.Opportunitys || [];

//           return (
//             <Droppable key={stage.id} droppableId={stage.id.toString()}>
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className="bg-gray-100 p-4 w-64 rounded-lg"
//                 >
//                   <h3 className="font-bold mb-2">{stage.name}</h3>
//                   {opportunities.map((opp: any, index: number) => (
//                     <Draggable
//                       key={opp.id}
//                       draggableId={opp.id.toString()}
//                       index={index}
//                     >
//                       {(prov) => (
//                         <div
//                           ref={prov.innerRef}
//                           {...prov.draggableProps}
//                           {...prov.dragHandleProps}
//                           className="bg-white p-3 mb-2 rounded shadow"
//                         >
//                           {opp.title || opp.name}
//                         </div>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           );
//         })}
//       </div>
//     </DragDropContext>
//   );
// }

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
