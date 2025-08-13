interface RawOfferData {
  id: string;
  name: string;
  price: string;
}

export interface MappedOffer {
  details: Array<{
    label: string;
    value: string | number;
  }>;
}

export class OffersMapper {
  details: Array<{
    label: string;
    value: string | number;
  }>;

  constructor(response: RawOfferData) {
    //the following will be an array of details
    this.details = [
      {
        label: "name",
        value: response.name,
      },
      {
        label: "price",
        value: `$${response.price}`,
      },
      {
        label: "id",
        value: response.id,
      },
    ];
  }

  static map(data: RawOfferData): MappedOffer {
    const mapper = new OffersMapper(data);
    return {
      details: mapper.details,
    };
  }

  static mapArray(dataArray: RawOfferData[]): MappedOffer[] {
    return dataArray.map((item) => OffersMapper.map(item));
  }
}
