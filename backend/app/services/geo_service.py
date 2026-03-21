from geopy.geocoders import Nominatim
from geopy.adapters import AioHTTPAdapter
from geopy.distance import geodesic

# Россия, Екатеринбург, улица Ленина, дом 1 - пример адреса

# функция получения координат по адресу
async def get_coordinates(address):
    async with Nominatim(
        user_agent="my_distance_calculator",
        adapter_factory=AioHTTPAdapter
    ) as geolocator:
        location = await geolocator.geocode(address) # type:ignore
        
        if location is not None:
            return (location.latitude, location.longitude)
        return None

# функция расчета расстояния между двумя точками
def calculate_distance(point_a, point_b):
    # point_a и point_b должны быть кортежами вида (lat, lon)
    return geodesic(point_a, point_b).kilometers