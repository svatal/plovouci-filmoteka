export interface IBasicEventInfo {
  channelName: string;
  startTime: Date;
  durationInMinutes: number;
  name: string;
  id: string;
}

export interface IExtendedEventInfo {
  tags: string[];
  description: string;
  posterUrl: string;
  mdbs: IMdbEntry[];
}

export interface IEventInfo extends IBasicEventInfo, IExtendedEventInfo {}

export interface IMdbEntry {
  text: string;
  link: string;
}
