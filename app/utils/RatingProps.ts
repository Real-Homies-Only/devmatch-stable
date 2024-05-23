interface ClientInterface {
  username: string;
  displayName: string;
  profilePicture: string;
}

interface ProjectInterface {
  projectName: string;
  clientId: string;
  client: ClientInterface;
}

export interface RatingInterface {
  id: string;
  rating: number;
  project: ProjectInterface;
  comment: string;
}
