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

export interface ITvMovie extends IExtendedEventInfo {
  name: string;
  events: ITvEvent[];
}
