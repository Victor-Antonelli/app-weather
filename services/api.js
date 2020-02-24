export const fetchLocationId = async city => {
    const response = await fetch(
        `https://www.metaweather.com/api/location/search/?query=${city}`,
    );
    const locations = await response.json();
    return locations[0].woeid;
};