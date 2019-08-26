import {
  IEventInfo,
  IMovie,
  IEvent,
  IBasicEventInfo,
  IExtendedEventInfo
} from "shared/event";

export function merge(events: IEventInfo[]): IMovie[] {
  return events.reduce(tryAppendEventToMovies, <IMovie[]>[]);
}

function tryAppendEventToMovies(movies: IMovie[], e: IEventInfo): IMovie[] {
  for (let i = 0; i < movies.length; i++) {
    if (tryAppendEventToMovie(movies[i], e)) return movies;
  }
  return [...movies, toMovie(e, e)];
}

function tryAppendEventToMovie(m: IMovie, e: IEventInfo): IMovie | null {
  if (
    m.posterUrl !== e.posterUrl ||
    m.description !== e.description ||
    m.tags.length !== e.tags.length ||
    m.mdbs.length !== e.mdbs.length
  )
    return null;
  m.events.push(toEvent(e));
  return m;
}

function toEvent(e: IBasicEventInfo, groupName?: string): IEvent {
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
  be: IBasicEventInfo,
  groupName?: string
): IMovie {
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
  events: IBasicEventInfo[],
  extended: IExtendedEventInfo,
  groupName: string
): IMovie {
  const movie = toMovie(extended, events[0], groupName);
  events.slice(1).forEach(e => movie.events.push(toEvent(e, groupName)));
  return movie;
}
