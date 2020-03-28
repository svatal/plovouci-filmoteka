export interface ITvEvent {
  channelName: string;
  startTime: Date;
  durationInMinutes: number;
  id: string;
  name?: string; // episode name
}

export interface IBasicTvEventInfo extends ITvEvent {
  name: string;
}

export interface IExtendedEventInfo {
  tags: string[];
  description: string;
  posterUrl: string;
  year: number;
  mdbs: IMdbEntry[];
}

export interface ITvEventInfo extends IBasicTvEventInfo, IExtendedEventInfo {}

export interface IMdbEntry {
  text: string;
  link: string;
}

export interface IMovie extends IExtendedEventInfo {
  name: string;
}

export interface ITvMovie extends IMovie {
  events: ITvEvent[];
}

export interface IFile {
  path: string;
}

export interface IFileMovie extends IMovie {
  durationInMinutes: number;
  files: IFile[];
}

export function isSameMovie(
  m: IExtendedEventInfo,
  e: IExtendedEventInfo
): boolean {
  return (
    m.posterUrl === e.posterUrl &&
    m.description === e.description &&
    m.tags.length === e.tags.length &&
    m.mdbs.length === e.mdbs.length
  );
}
