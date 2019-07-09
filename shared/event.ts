export interface IEvent {
  channelName: string;
  startTime: Date;
  durationInMinutes: number;
  id: string;
  name?: string;
}

export interface IBasicEventInfo extends IEvent {
  name: string;
}

export interface IExtendedEventInfo {
  tags: string[];
  description: string;
  posterUrl: string;
  year: number;
  mdbs: IMdbEntry[];
}

export interface IEventInfo extends IBasicEventInfo, IExtendedEventInfo {}

export interface IMdbEntry {
  text: string;
  link: string;
}

export interface IMovie extends IExtendedEventInfo {
  name: string;
  events: IEvent[];
}
