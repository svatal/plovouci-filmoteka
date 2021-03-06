import * as b from "bobril";
import { IFileMovie } from "shared/event";
import { Button } from "bobrilstrap";
import { isChecked, markAsChecked } from "./checked";
import { EventList } from "./movieList";

export function ManageMovies(props: { movies: IFileMovie[] }) {
  const filteredEvents = props.movies.filter(e => !isChecked(e));

  return (
    <>
      {filteredEvents.length} / {props.movies.length}
      <EventList
        movies={filteredEvents}
        greyedHeading={isChecked}
        actionButton={m =>
          !isChecked(m) && (
            <Button onClick={() => markAsChecked(m)}>
              Označit jako zkontrolováno
            </Button>
          )
        }
      />
    </>
  );
}
