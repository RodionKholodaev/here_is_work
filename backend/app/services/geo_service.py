from geopy.geocoders import Nominatim
from geopy.adapters import AioHTTPAdapter
from geopy.distance import geodesic
import requests

YANDEX_API_KEY = "0e2f26fb-0dd2-4844-b9b2-1ff5867cb501"
# Россия, Екатеринбург, улица Ленина, дом 1 - пример адреса

# функция получения координат по адресу

async def get_coordinates(address: str):
    url = "https://geocode-maps.yandex.ru/1.x/"
    params = {
        "geocode": address,
        "format": "json",
        "apikey": YANDEX_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    try:
        pos = data["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"]
        lon, lat = map(float, pos.split())
        return {"lat": lat, "lon": lon}
    except (IndexError, KeyError):
        return None

print(get_coordinates("Москва, Красная площадь 1"))

# функция расчета расстояния между двумя точками
def calculate_distance(point_a, point_b):
    # point_a и point_b должны быть кортежами вида (lat, lon)
    return geodesic(point_a, point_b).kilometers