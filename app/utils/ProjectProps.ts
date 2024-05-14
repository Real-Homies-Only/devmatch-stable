import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.string(),
  projectName: z.string(),
  category: z.string(),
  language: z.string(),
  description: z.string(),
  clientId: z.string(),
  developerId: z.string()
});

export type ProjectType = z.infer<typeof ProjectSchema>;

export interface ProjectInterface {
  id: string;
  projectName: string;
  category: string;
  language: string;
  description: string;
  clientId: string;
  developerId: string;
}

export interface ProjectProps {
  project: ProjectType;
}
