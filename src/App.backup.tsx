import { useState } from "react";
import { ListOfIssues, Project } from "./schema";
import { useAccount } from "./main";
import { Group, ID } from "jazz-tools";
import { ProjectComponent } from "./components/Project";

function App() {
  const { me } = useAccount();
  const [projectID, setProjectID] = useState<ID<Project> | undefined>(
    (window.location.search?.replace("?project=", "") || undefined) as
      | ID<Project>
      | undefined
  );

  const createProject = () => {
    const group = Group.create({ owner: me });
    const newProject = Project.create(
      {
        name: "buy guitar",
        issues: ListOfIssues.create([], { owner: group }),
      },
      { owner: group }
    );
    setProjectID(newProject.id);
    window.history.pushState({}, "", `?project=${newProject.id}`);
  };

  if (projectID) {
    return (
      <>
        <h1>{me.profile?.name}</h1>
        <ProjectComponent projectID={projectID} />
      </>
    );
  } else {
    return <button onClick={createProject}>Create Project</button>;
  }
}

export default App;
