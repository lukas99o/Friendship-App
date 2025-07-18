interface EventParticipantDto {
  userName: string;
  role: string; 
}

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
  eventParticipants?: EventParticipantDto[];
  description?: string;
}
