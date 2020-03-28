import {
  ITvEventInfo,
  ITvMovie,
  ITvEvent,
  IBasicTvEventInfo,
  IExtendedEventInfo,
  isSameMovie
} from "shared/event";

export function merge(events: ITvEventInfo[]): ITvMovie[] {
  return events.reduce(tryAppendEventToMovies, <ITvMovie[]>[]);
}

function tryAppendEventToMovies(
  movies: ITvMovie[],
  e: ITvEventInfo
): ITvMovie[] {
  for (let i = 0; i < movies.length; i++) {
    if (tryAppendEventToMovie(movies[i], e)) return movies;
  }
  return [...movies, toMovie(e, e)];
}

function tryAppendEventToMovie(m: ITvMovie, e: ITvEventInfo): ITvMovie | null {
  if (!isSameMovie(m, e)) return null;
  m.events.push(toEvent(e));
  return m;
}

function toEvent(e: IBasicTvEventInfo, groupName?: string): ITvEvent {
  return {
    channelName: e.channelName,
    durationInMinutes: e.durationInMinutes,
    id: e.id,
    startTime: e.startTime,
    name:
      groupName === undefined || groupName === e.name
        ? undefined
        : e.name.substr(groupName.length + 1)
  };
}

function toMovie(
  ee: IExtendedEventInfo,
  be: IBasicTvEventInfo,
  groupName?: string
): ITvMovie {
  return {
    description: ee.description,
    // groupName === undefined || groupName === be.name ? ee.description : "",
    mdbs: ee.mdbs,
    name: groupName || be.name,
    posterUrl: ee.posterUrl,
    year: ee.year,
    tags: ee.tags,
    events: [toEvent(be, groupName)]
  };
}

export function mergeToOne(
  events: IBasicTvEventInfo[],
  extended: IExtendedEventInfo,
  groupName: string
): ITvMovie {
  const movie = toMovie(extended, events[0], groupName);
  events.slice(1).forEach(e => movie.events.push(toEvent(e, groupName)));
  return movie;
}
