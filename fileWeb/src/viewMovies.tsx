import * as b from "bobril";
import * as bs from "bobrilstrap";
import { EventDetail } from "./eventDetail";
import * as sb from "./sortBy";
import * as f from "web-shared/filter";
import { create as Filter } from "web-shared/filter";
import { IFileMovie, IExtendedEventInfo } from "shared/event";
import { isSeen, markAsSeen } from "./seen";
import { Button } from "bobrilstrap";

const eventsOnPage = 20;

function createUnseenFilter(): f.IFilterWithLabel<IFileMovie> {
  return { id: "neviděno", label: "neviděno", test: movie => !isSeen(movie) };
}

export function ViewMovies(props: { movies: IFileMovie[] }) {
  const [sortId, setSortId] = b.useState(sb.defaultValue);
  const [filter, setFilter] = b.useState<f.IFilter<IFileMovie>[]>([
    createUnseenFilter()
  ]);
  const [displayMax, setDisplayMax] = b.useState(eventsOnPage);

  const filteredEvents = props.movies.filter(e => filter.every(f => f.test(e)));
  const filteredTagCounts = getTagCounts(filteredEvents);
  const tagInfos = Object.getOwnPropertyNames(filteredTagCounts).map<
    f.ITagInfo
  >(n => ({
    name: n,
    selectionCount: filteredTagCounts[n]
  }));

  return (
    <>
      <Filter
        tags={tagInfos}
        eventCount={props.movies.length}
        selectedCount={filteredEvents.length}
        customFilters={[createUnseenFilter()]}
        filter={filter}
        onChange={filter => {
          setFilter(filter);
          setDisplayMax(eventsOnPage);
        }}
        getDurationsInMinutes={getDurationsInMinutes}
      />
      <sb.create
        options={sb.options}
        selected={sortId}
        onChange={selected => {
          setSortId(selected);
          setDisplayMax(eventsOnPage);
        }}
      ></sb.create>
      {filteredEvents
        .sort((a, b) => sb.sort(a, b, sb.options[sortId]))
        .slice(0, displayMax)
        .map(m => (
          <EventDetail
            movie={m}
            greyedHeading={isSeen(m)}
            actionButton={
              !isSeen(m) && (
                <Button onClick={() => markAsSeen(m)}>
                  Označit jako viděno
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

function getTagCounts(events: IExtendedEventInfo[]) {
  let tags: { [tag: string]: number } = {};
  events.forEach(e => {
    e.tags.forEach(t => (tags[t] = (tags[t] === undefined ? 0 : tags[t]) + 1));
  });
  return tags;
}

function getDurationsInMinutes(movie: IFileMovie) {
  return [movie.durationInMinutes];
}
