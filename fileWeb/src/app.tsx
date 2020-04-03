import * as b from "bobril";
import { IFileMovie } from "shared/event";
import { H1, Button, ButtonGroup } from "bobrilstrap";
import { ViewMovies } from "./viewMovies";
import { ManageMovies } from "./manageMovies";

enum ActiveTab {
  View,
  Manage
}

export function App(props: { movies: IFileMovie[] }) {
  const [activeTab, setActiveTab] = b.useState(ActiveTab.View);

  return (
    <div style={{ padding: 10 }}>
      <H1>"Filmotéka"</H1>
      <div>
        <ButtonGroup>
          <Button
            active={activeTab === ActiveTab.View}
            onClick={() => setActiveTab(ActiveTab.View)}
          >
            Prohlížet
          </Button>
          <Button
            active={activeTab === ActiveTab.Manage}
            onClick={() => setActiveTab(ActiveTab.Manage)}
          >
            Kontrolovat
          </Button>
        </ButtonGroup>
      </div>
      {activeTab === ActiveTab.View && <ViewMovies movies={props.movies} />}
      {activeTab === ActiveTab.Manage && <ManageMovies movies={props.movies} />}
    </div>
  );
}
