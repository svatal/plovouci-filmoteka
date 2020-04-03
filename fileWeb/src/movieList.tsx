import * as b from "bobril";
import * as bs from "bobrilstrap";
import { MovieDetail } from "./movieDetail";
import { IFileMovie } from "shared/event";
import { Button } from "bobrilstrap";

const moviesOnPage = 20;

export function EventList(props: {
  movies: IFileMovie[];
  greyedHeading: (movie: IFileMovie) => boolean;
  actionButton: (movie: IFileMovie) => b.IBobrilChild;
}) {
  const [displayMax, setDisplayMax] = b.useState(moviesOnPage);
  return (
    <>
      {props.movies.slice(0, displayMax).map(m => (
        <MovieDetail
          movie={m}
          greyedHeading={props.greyedHeading(m)}
          actionButton={props.actionButton(m)}
          key={m.files[0].path}
        />
      ))}
      {props.movies.length > displayMax && (
        <Button
          style={bs.helpers.centerBlock}
          onClick={() => setDisplayMax(displayMax + moviesOnPage)}
        >
          Další
        </Button>
      )}
    </>
  );
}
