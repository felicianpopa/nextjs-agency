interface RawHotelData {
  name: string;
  rate: string;
  price: number;
  image?: string;
}

export interface MappedHotel {
  image?: string;
  details: Array<{
    label: string;
    value: string | number;
  }>;
}

export class HotelsMapper {
  image?: string;
  details: Array<{
    label: string;
    value: string | number;
  }>;

  constructor(response: RawHotelData) {
    this.image = response.image;
    //the following will be an array of details
    this.details = [
      {
        label: "name",
        value: response.name,
      },
      {
        label: "price",
        value: response.price,
      },
      {
        label: "rate",
        value: response.rate,
      },
    ];
  }

  static map(data: RawHotelData): MappedHotel {
    const mapper = new HotelsMapper(data);
    return {
      image: mapper.image,
      details: mapper.details,
    };
  }

  static mapArray(dataArray: RawHotelData[]): MappedHotel[] {
    return dataArray.map((item) => HotelsMapper.map(item));
  }
}
