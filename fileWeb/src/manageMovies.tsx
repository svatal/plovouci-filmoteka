import * as b from "bobril";
import * as bs from "bobrilstrap";
import { EventDetail } from "./eventDetail";
import { IFileMovie } from "shared/event";
import { Button } from "bobrilstrap";
import { isChecked, markAsChecked } from "./checked";

const eventsOnPage = 20;

export function ManageMovies(props: { movies: IFileMovie[] }) {
  const [displayMax, setDisplayMax] = b.useState(eventsOnPage);
  const filteredEvents = props.movies.filter(e => !isChecked(e));

  return (
    <>
      {filteredEvents.length} / {props.movies.length}
      {filteredEvents.slice(0, displayMax).map(m => (
        <EventDetail
          movie={m}
          greyedHeading={isChecked(m)}
          actionButton={
            !isChecked(m) && (
              <Button onClick={() => markAsChecked(m)}>
                Označit jako zkontrolováno
              </Button>
            )
          }
          key={m.files[0].path}
        />
      ))}
      {filteredEvents.length > displayMax && (
        <div style={bs.helpers.centerBlock}>
          <Button onClick={() => setDisplayMax(displayMax + eventsOnPage)}>
            Další
          </Button>
        </div>
      )}
    </>
  );
}
