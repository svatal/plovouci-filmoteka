import { IEventInfo, IMovie, IEvent } from "../../shared/event";

export function merge(events: IEventInfo[]): IMovie[] {
  return events.reduce(tryAppendEventToMovies, <IMovie[]>[]);
}

function tryAppendEventToMovies(movies: IMovie[], e: IEventInfo): IMovie[] {
  for (let i = 0; i < movies.length; i++) {
    if (tryAppendEventToMovie(movies[i], e)) return movies;
  }
  return [...movies, toMovie(e)];
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

function toEvent(e: IEventInfo): IEvent {
  return {
    channelName: e.channelName,
    durationInMinutes: e.durationInMinutes,
    id: e.id,
    startTime: e.startTime
  };
}

function toMovie(e: IEventInfo): IMovie {
  return {
    description: e.description,
    mdbs: e.mdbs,
    name: e.name,
    posterUrl: e.posterUrl,
    tags: e.tags,
    events: [toEvent(e)]
  };
}
