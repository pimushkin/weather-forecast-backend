export interface IWeatherApiResponse {
    wind: { speed: number },
    weather: IWeather[],
    main: { pressure: number, humidity: number, temp: number },
    coord: { lon: number, lat: number },
    name: string,
    id: number
}

export interface IWeather {
    description: string
    icon: string
}