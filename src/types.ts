export interface EventDto {
  eventId: number;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  ageRangeMax: number;
  ageRangeMin: number;
  interests: string[];
  img: string;
}
