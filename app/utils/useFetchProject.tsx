import { useEffect, useState } from "react";
import { ProjectType } from "./ProjectProps";

const useFetchProject = (projectId: string, userId: string) => {
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loadingProject, setLoading] = useState(true);
  useEffect(() => {
    const getProject = async () => {
      const response = await fetch(`/api/project/${projectId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const { project } = await response.json();
      setProject(project);
      setLoading(false);
    };
    getProject();
  }, [projectId, userId]);

  return { project, loadingProject };
};

export default useFetchProject;
