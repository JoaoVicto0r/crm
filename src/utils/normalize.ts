// src/utils/normalize.ts

export interface NormalizedOpportunity {
  id: number;
  name: string;
  title?: string;
  value?: number;
  Contacts?: { name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface NormalizedStage {
  id: number;
  name: string;
  order?: number;
  opportunities: NormalizedOpportunity[];
  Opportunitys?: NormalizedOpportunity[]; // Para compatibilidade
}

export interface NormalizedPipeline {
  id: number;
  name: string;
  stages: NormalizedStage[];
  Stages?: NormalizedStage[]; // Para compatibilidade
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Normaliza os dados do pipeline para uma estrutura consistente
 */
export const normalizePipeline = (pipeline: any): NormalizedPipeline => {
  const rawStages = pipeline.stages || pipeline.Stages || [];

  const stages: NormalizedStage[] = rawStages.map((stage: any) => ({
    id: stage.id,
    name: stage.name,
    order: stage.order,
    opportunities: stage.opportunities || stage.Opportunitys || [],
  }));

  return {
    id: pipeline.id,
    name: pipeline.name,
    stages,
    createdAt: pipeline.createdAt,
    updatedAt: pipeline.updatedAt,
  };
};

/**
 * Normaliza uma lista de pipelines
 */
export const normalizePipelines = (pipelines: any[]): NormalizedPipeline[] => {
  return pipelines.map(normalizePipeline);
};
