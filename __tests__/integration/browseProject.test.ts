import { GET } from "@/app/api/browse/[id]/route";
import { prisma } from "@/app/utils/prisma";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn()
}));

describe("GET Projects", () => {
  const mockProjects = [
    {
      id: "1",
      projectName: "Project 1",
      category: "Category 1",
      language: "Language 1",
      description: "Description 1",
      clientId: "clientId1",
      developerId: null,
      projectPicture: "picture1.jpg",
      progress: 0,
      finished: false
    },
    {
      id: "2",
      projectName: "Project 2",
      category: "Category 2",
      language: "Language 2",
      description: "Description 2",
      clientId: "clientId2",
      developerId: null,
      projectPicture: "",
      progress: 0,
      finished: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(prisma.projects, "findMany").mockResolvedValue(mockProjects);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should return projects with signed URLs", async () => {
    const mockSignedUrl = "https://example.com/picture1.jpg";
    const getSignedUrlMock = getSignedUrl as jest.MockedFunction<
      typeof getSignedUrl
    >;
    getSignedUrlMock.mockResolvedValueOnce(mockSignedUrl);

    const response = await GET();
    const projects = await response.json();

    expect(response.status).toBe(200);
    expect(projects).toEqual([
      {
        ...mockProjects[0],
        projectPicture: mockSignedUrl
      },
      mockProjects[1]
    ]);
  });

  it("should fail to fetch fetch projects", async () => {
    const mockError = new Error("Failed to fetch projects");
    jest.spyOn(prisma.projects, "findMany").mockRejectedValue(mockError);

    const response = await GET();
    const error = await response.json();

    expect(response.status).toBe(500);
    expect(error).toEqual({ error: "Failed to fetch projects" });
  });
});
